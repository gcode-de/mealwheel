import {
  Select,
  H2,
  Button,
  List,
  ListItem,
  Spacer,
} from "@/components/Styled/Styled";
import Input from "@/components/Styled/StyledInput";

import AddButton from "@/components/Button/AddButton";
import Header from "@/components/Styled/Header";
import { Plus, PlateWheel, Check } from "@/helpers/svg";
import StyledIngredients from "@/components/Styled/StyledIngredients";
import IconButtonLarge from "@/components/Button/IconButtonLarge";

import updateUserinDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import { ingredientUnits } from "@/helpers/ingredientUnits";
import fetchCategorizedIngredients from "@/helpers/OpenAI/CategorizeIngredients";
import validateShoppinglistItems from "@/helpers/OpenAI/validateShoppinglistItems";
import updateUserInDb from "@/helpers/updateUserInDb";

import styled from "styled-components";
import { useRef, useState } from "react";
import Link from "next/link";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function ShoppingList({
  user,
  mutateUser,
  userIsHouseholdAdmin,
  household,
  mutateHousehold,
}) {
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [durationAiGenerating, setDurationAiGenerating] = useState(0);
  const editFormRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(null);

  function handleItemClick(category, index) {
    setEditingIndex(`${category},${index}`);
  }

  function handleItemEdit(eventTarget, categoryName, itemIndex) {
    if (!userIsHouseholdAdmin) {
      notifyError("Du besitzt keine Schreibrechte für diesen Haushalt.");
      return;
    }
    const formData = new FormData(eventTarget);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);

    const category = household.shoppingList.find(
      (cat) => cat.category === categoryName
    );

    if (category) {
      const updatedItem = {
        ...category.items[itemIndex],
        ...data,
      };

      category.items[itemIndex] = updatedItem;

      updateHouseholdInDb(household, mutateHousehold);
      setEditingIndex("");
    } else {
      console.log("Kategorie nicht gefunden.");
    }
  }

  if (!user) {
    return (
      <>
        <Header text="Einkaufsliste" />
        <List>
          Bitte <Link href="/api/auth/signin">einloggen</Link>, um die
          Einkaufsliste zu verwenden.
        </List>
      </>
    );
  }

  if (!household) {
    return (
      <>
        <Header text={"Einkaufsliste"} />
        <List>
          Der Haushalt konnte nicht geladen werden. Bitte wähle in den{" "}
          <Link href="/profile/settings">Einstellungen</Link> einen gültigen
          Haushalt aus, auf den du Zugriff hast.
        </List>
      </>
    );
  }

  function consolidateShoppingListItems(userShoppingList) {
    if (!validateShoppinglistItems(userShoppingList)) {
      console.error("Shoppingliste enthält ungültige Daten.");
      return;
    }

    const allItems = new Map();

    // Sammle alle Items über alle Kategorien hinweg
    userShoppingList.forEach((category) => {
      category.items.forEach((item) => {
        const key = `${item.name}-${item.unit}`;
        if (allItems.has(key)) {
          const existingItem = allItems.get(key);
          existingItem.quantity += item.quantity;
        } else {
          allItems.set(key, { ...item, categories: [category.category] });
        }
      });
    });

    // Leere die ursprüngliche Liste und füge konsolidierte Items hinzu
    userShoppingList.splice(0, userShoppingList.length); // Leert das Array, behält aber die Referenz bei

    allItems.forEach((item, key) => {
      const [name, unit] = key.split("-");
      const categoryNames = item.categories;

      categoryNames.forEach((categoryName) => {
        // Finde oder erstelle die Kategorie
        let category = userShoppingList.find(
          (c) => c.category === categoryName
        );
        if (!category) {
          category = { category: categoryName, items: [] };
          userShoppingList.push(category);
        }

        category.items.push({
          name,
          quantity: item.quantity,
          unit,
          isChecked: item.isChecked,
        });
      });
    });

    //Entferne leere Kategorien,
    const nonEmptyCategories = userShoppingList.filter(
      (category) => category.items.length > 0
    );
    userShoppingList.splice(0, userShoppingList.length, ...nonEmptyCategories);
  }

  consolidateShoppingListItems(household.shoppingList);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);
    if (!household.shoppingList) {
      household.shoppingList = [];
    }

    const unsortedIndex = household.shoppingList.findIndex(
      (category) => category.category === "Unsortiert"
    );

    if (unsortedIndex !== -1) {
      household.shoppingList[unsortedIndex].items.push({
        ...data,
        isChecked: false,
      });
    } else {
      household.shoppingList.push({
        name: "Unsortiert",
        items: [{ ...data, isChecked: false }],
      });
    }

    updateHouseholdInDb(household, mutateHousehold);
    event.target.reset();
  }

  function handleCheckboxChange(categoryName, itemIndex) {
    if (!userIsHouseholdAdmin) {
      notifyError("Du besitzt keine Schreibrechte für diesen Haushalt.");
      return;
    }

    const categoryIndex = household.shoppingList.findIndex(
      (c) => c.category === categoryName
    );
    if (categoryIndex === -1) {
      console.error("Kategorie nicht gefunden");
      return;
    }

    const newUserShoppingList = [...household.shoppingList];
    newUserShoppingList[categoryIndex].items[itemIndex].isChecked =
      !newUserShoppingList[categoryIndex].items[itemIndex].isChecked;

    updateHouseholdInDb(household, mutateHousehold);

    setTimeout(async () => {
      const updatedCategories = [...household.shoppingList];
      const updatedItems = updatedCategories[categoryIndex].items.filter(
        (item) => !item.isChecked
      );

      if (updatedItems.length > 0) {
        updatedCategories[categoryIndex].items = updatedItems;
      } else {
        // Entferne die Kategorie, wenn alle Items gecheckt sind
        updatedCategories.splice(categoryIndex, 1);
      }
      household.shoppingList = updatedCategories;

      updateHouseholdInDb(household, mutateHousehold);
    }, 10000);
  }

  function clearShopping() {
    household.shoppingList = [];
    updateHouseholdInDb(household, mutateHousehold);
  }

  async function setCategories() {
    if (household.shoppingList.length === 0) {
      notifyError("Bitte befülle zuerst deine Einkaufsliste.");
      return;
    }
    setIsAiGenerating(true);
    setDurationAiGenerating(45);

    const countdownInterval = setInterval(() => {
      setDurationAiGenerating((prevDuration) => {
        if (prevDuration > 1) return prevDuration - 1;
        clearInterval(countdownInterval); // Stoppe Countdown, wenn Dauer auf 0 ist
        return 0;
      });
    }, 1000);

    try {
      const dataFromAPI = await fetchCategorizedIngredients(
        JSON.stringify(household.shoppingList)
      );
      const parsedData = JSON.parse(dataFromAPI);

      if (!validateShoppinglistItems(parsedData)) {
        console.error(
          "Erhaltene KI-Daten entsprechen nicht dem erwarteten Schema."
        );
        return;
      }

      household.shoppingList = await parsedData;
      notifySuccess("Einkaufsliste wurde sortiert.");
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      if (error.message.startsWith("504")) {
        notifyError("KI ist überlastet. Bitte später versuchen!");
      } else {
        notifyError("Sortieren fehlgeschlagen.");
      }
    }
    setIsAiGenerating(false);
    setDurationAiGenerating(0);
    updateHouseholdInDb(household, mutateHousehold);
  }

  return (
    <>
      <Header text="Einkaufsliste" />
      <List>
        {household.shoppingList.length === 0 && (
          <ListItem key="empty">
            <StyledCheck>nichts zu erledigen</StyledCheck>
          </ListItem>
        )}
        {household.shoppingList.map(({ category, items }) =>
          items?.length ? (
            <div key={category}>
              <RestyledH2>{category}</RestyledH2>
              {items.map((item, index) => (
                <RestyledListItem
                  key={index}
                  onClick={() => handleItemClick(category, index)}
                  onBlur={(event) =>
                    handleItemEdit(event.target.parentElement, category, index)
                  }
                >
                  {editingIndex === `${category},${index}` ? (
                    <StyledEditForm
                      ref={editFormRef}
                      onSubmit={(event) =>
                        handleItemEdit(event.target, category, index)
                      }
                    >
                      <Input
                        $width={"4rem"}
                        type="number"
                        defaultValue={item.quantity}
                        min="0"
                        step="0.01"
                        aria-label="edit ingredient quantity for the recipe"
                        name="quantity"
                      />
                      <Select name="unit" defaultValue={item.unit}>
                        <option value="">-</option>
                        {ingredientUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="text"
                        defaultValue={item.name}
                        aria-label="edit ingredient name for the recipe"
                        name="name"
                        required
                      />
                      <AddButton type="submit" $color="var(--color-background)">
                        <Check width={20} height={20} />
                      </AddButton>
                    </StyledEditForm>
                  ) : (
                    <>
                      <StyledCheck>
                        <StyledNumberUnit>
                          <StyledCheckItem $text={item.isChecked} $flex={0.1}>
                            {item.quantity}
                          </StyledCheckItem>
                          <StyledCheckItem $text={item.isChecked} $flex={0.5}>
                            {item.unit}
                          </StyledCheckItem>
                        </StyledNumberUnit>
                        <StyledCheckItem $text={item.isChecked} $flex={2}>
                          {item.name}
                        </StyledCheckItem>
                      </StyledCheck>
                      <StyledCheckbox
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={(event) => {
                          handleCheckboxChange(category, index);
                          event.stopPropagation();
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        onBlur={(event) => {
                          event.stopPropagation();
                        }}
                      ></StyledCheckbox>
                    </>
                  )}
                </RestyledListItem>
              ))}
            </div>
          ) : (
            ""
          )
        )}
        {userIsHouseholdAdmin && (
          <form onSubmit={handleSubmit}>
            <StyledIngredients>
              <Input
                type="number"
                $width={"4rem"}
                min="0"
                step="0.01"
                aria-label="add ingredient quantity for the recipe"
                name="quantity"
              />
              <Select name="unit">
                <option value="">-</option>
                {ingredientUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
              <Input
                type="text"
                name="name"
                placeholder="neue Zutat"
                aria-label="add igredient name for the recipe"
                required
              />
              <AddButton type="submit" $color="var(--color-background)">
                <Plus width={20} height={20} />
              </AddButton>
            </StyledIngredients>
          </form>
        )}
      </List>
      {household.shoppingList.length > 0 && userIsHouseholdAdmin && (
        <>
          <StyledButton
            onClick={setCategories}
            aria-label="trigger AI-based sorting and grouping of items (this takes a moment)"
          >
            <RotatingSVG $rotate={isAiGenerating} />
            {!isAiGenerating
              ? "Sortieren"
              : `bitte warten... (${durationAiGenerating})`}
          </StyledButton>
        </>
      )}
      <Spacer />
      {userIsHouseholdAdmin && (
        <IconButtonLarge
          style={"trash"}
          bottom="5rem"
          onClick={clearShopping}
        />
      )}
    </>
  );
}
const StyledCheck = styled.div`
  background-color: var(--color-background);
  border-radius: var(--border-radius-small);
  height: 30px;
  width: 100%;
  padding: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-between);
`;
const StyledCheckItem = styled.p`
  border-radius: var(--border-radius-small);
  flex-grow: ${(props) => props.$flex};
  text-decoration: ${(props) => (props.$text ? "line-through" : "none")};
  overflow-wrap: break-word;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: balance;
`;
const StyledCheckbox = styled.input`
  background-color: var(--color-background);
  margin: 0;
  width: 37px;
  height: 30px;
  z-index: 2;
`;
const StyledNumberUnit = styled.div`
  width: 35%;
  display: flex;
  gap: 3px;
`;

const StyledEditForm = styled.form`
  display: flex;
  width: 100%;
  gap: 0.25rem;
`;

const RotatingSVG = styled(PlateWheel)`
  width: 1.5rem;
  animation: ${(props) =>
    props.$rotate ? "rotate 2s linear infinite" : "none"};
  fill: var(--color-component);

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledButton = styled(Button)`
  padding: 8px 15px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: max-content;
  margin-right: var(--gap-out);
  margin-left: auto;
`;

const RestyledH2 = styled(H2)`
  font-size: 1rem;
  margin: 1rem 0 0 0;
`;

const RestyledListItem = styled(ListItem)`
  align-items: center;
`;
