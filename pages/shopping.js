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
import { PageError, PageLoading } from "@/components/PageState";

export default function ShoppingList({
  user,
  mutateUser,
  userIsHouseholdAdmin,
  household,
  mutateHousehold,
  error,
  isLoading,
}) {
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [durationAiGenerating, setDurationAiGenerating] = useState(0);
  const editFormRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(null);

  if (error) {
    return (
      <PageError
        title="Einkaufsliste"
        message="Die Einkaufsliste konnte nicht geladen werden."
        onRetry={() => Promise.all([mutateUser?.(), mutateHousehold?.()])}
      />
    );
  }

  if (isLoading) {
    return (
      <PageLoading
        title="Einkaufsliste"
        amount
        label="Einkaufsliste wird geladen"
      />
    );
  }

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

    const category = shoppingList.find(
      (cat) => cat.category === categoryName
    );

    if (category) {
      const updatedItem = {
        ...category.items[itemIndex],
        ...data,
      };

      const updatedShoppingList = shoppingList.map((currentCategory) =>
        currentCategory.category === categoryName
          ? {
              ...currentCategory,
              items: currentCategory.items.map((item, index) =>
                index === itemIndex ? updatedItem : item
              ),
            }
          : currentCategory
      );

      updateHouseholdInDb(
        { ...household, shoppingList: updatedShoppingList },
        mutateHousehold
      );
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
      return userShoppingList || [];
    }

    const consolidatedList = userShoppingList.map((category) => ({
      ...category,
      items: category.items.map((item) => ({ ...item })),
    }));

    const allItems = new Map();

    // Sammle alle Items über alle Kategorien hinweg
    consolidatedList.forEach((category) => {
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
    consolidatedList.splice(0, consolidatedList.length);

    allItems.forEach((item, key) => {
      const [name, unit] = key.split("-");
      const categoryNames = item.categories;

      categoryNames.forEach((categoryName) => {
        // Finde oder erstelle die Kategorie
        let category = consolidatedList.find(
          (c) => c.category === categoryName
        );
        if (!category) {
          category = { category: categoryName, items: [] };
          consolidatedList.push(category);
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
    const nonEmptyCategories = consolidatedList.filter(
      (category) => category.items.length > 0
    );
    return nonEmptyCategories;
  }

  const shoppingList = consolidateShoppingListItems(household.shoppingList);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);
    const unsortedIndex = shoppingList.findIndex(
      (category) => category.category === "Unsortiert"
    );

    const newItem = { ...data, isChecked: false };
    const updatedShoppingList =
      unsortedIndex !== -1
        ? shoppingList.map((category, index) =>
            index === unsortedIndex
              ? { ...category, items: [...category.items, newItem] }
              : category
          )
        : [...shoppingList, { category: "Unsortiert", items: [newItem] }];

    updateHouseholdInDb(
      { ...household, shoppingList: updatedShoppingList },
      mutateHousehold
    );
    event.target.reset();
  }

  function handleCheckboxChange(categoryName, itemIndex) {
    if (!userIsHouseholdAdmin) {
      notifyError("Du besitzt keine Schreibrechte für diesen Haushalt.");
      return;
    }

    const categoryIndex = shoppingList.findIndex(
      (c) => c.category === categoryName
    );
    if (categoryIndex === -1) {
      console.error("Kategorie nicht gefunden");
      return;
    }

    const newUserShoppingList = shoppingList.map((category, index) =>
      index === categoryIndex
        ? {
            ...category,
            items: category.items.map((item, index) =>
              index === itemIndex
                ? { ...item, isChecked: !item.isChecked }
                : item
            ),
          }
        : category
    );

    updateHouseholdInDb(
      { ...household, shoppingList: newUserShoppingList },
      mutateHousehold
    );
  }

  async function clearShopping() {
    await updateHouseholdInDb(
      { ...household, shoppingList: [] },
      mutateHousehold
    );
  }

  async function removeCheckedItems() {
    const updatedCategories = shoppingList
      .map((category) => {
        const filteredItems = category.items.filter((item) => !item.isChecked);
        return { ...category, items: filteredItems };
      })
      .filter((category) => category.items.length > 0);

    notifySuccess("Abgehakte Items gelöscht.");
    await updateHouseholdInDb(
      { ...household, shoppingList: updatedCategories },
      mutateHousehold
    );
  }

  async function setCategories() {
    if (shoppingList.length === 0) {
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
        JSON.stringify(shoppingList)
      );
      const parsedData = JSON.parse(dataFromAPI);

      if (!validateShoppinglistItems(parsedData)) {
        console.error(
          "Erhaltene KI-Daten entsprechen nicht dem erwarteten Schema."
        );
        return;
      }

      await updateHouseholdInDb(
        { ...household, shoppingList: parsedData },
        mutateHousehold
      );
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
  }

  return (
    <>
      <Header text="Einkaufsliste" />
      <List>
        {shoppingList.length === 0 && (
          <ListItem key="empty">
            <StyledCheck>nichts zu erledigen</StyledCheck>
          </ListItem>
        )}
        {shoppingList.map(({ category, items }) =>
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
                        placeholder="Anz."
                      />
                      <Select name="unit" defaultValue={item.unit}>
                        <option value="">Einh.</option>
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
                      <AddButton
                        type="submit"
                        $color="var(--color-background)"
                        aria-label="Änderungen an der Zutat speichern"
                      >
                        <Check width={20} height={20} />
                      </AddButton>
                    </StyledEditForm>
                  ) : (
                    <>
                      <StyledCheck>
                        {item.quantity > 0 && (
                          <>
                            <StyledNumber>
                              <StyledCheckItem $text={item.isChecked}>
                                {item.quantity}
                              </StyledCheckItem>
                            </StyledNumber>
                            <StyledUnit>
                              <StyledCheckItem $text={item.isChecked}>
                                {item.unit}
                              </StyledCheckItem>
                            </StyledUnit>
                          </>
                        )}
                        <StyledCheckItem $text={item.isChecked} $flex={1}>
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
          <StyledForm onSubmit={handleSubmit}>
            <StyledIngredients>
              <Input
                type="number"
                $width={"4rem"}
                min="0"
                step="0.01"
                aria-label="add ingredient quantity for the recipe"
                name="quantity"
                placeholder="Anz."
              />
              <Select name="unit">
                <option value="">Einh.</option>
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
              <AddButton
                type="submit"
                $color="var(--color-background)"
                aria-label="Zutat hinzufügen"
              >
                <Plus width={25} height={25} />
              </AddButton>
            </StyledIngredients>
          </StyledForm>
        )}
      </List>
      {shoppingList.length > 0 && userIsHouseholdAdmin && (
        <ButtonContainer>
          <StyledButton
            onClick={removeCheckedItems}
            aria-label="remove checked items from list"
            className={
              shoppingList.some((category) =>
                category.items.some((item) => item.isChecked)
              )
                ? ""
                : "invisible"
            }
          >
            Erledigte Entfernen
          </StyledButton>
          <StyledButton
            onClick={setCategories}
            aria-label="trigger AI-based sorting and grouping of items (this takes a moment)"
          >
            <RotatingSVG $rotate={isAiGenerating} />
            {!isAiGenerating
              ? "Sortieren"
              : `bitte warten... (${durationAiGenerating})`}
          </StyledButton>
        </ButtonContainer>
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
  :nth-child(3) {
    overflow-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: balance;
    hyphens: auto;
  }
`;
const StyledCheckItem = styled.p`
  border-radius: var(--border-radius-small);
  flex-grow: ${(props) => props.$flex};
  text-decoration: ${(props) => (props.$text ? "line-through" : "none")};
  width: 100%;
`;
const StyledCheckbox = styled.input`
  background-color: var(--color-background);
  margin: 0;
  width: 37px;
  height: 30px;
  z-index: 2;
  border-radius: var(--border-radius-small);
`;
const StyledNumber = styled.div`
  max-width: 55px;
  margin-right: var(--gap-between);
`;
const StyledUnit = styled.div`
  max-width: 60px;
  margin-right: var(--gap-between);
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
  &.invisible {
    visibility: hidden;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
`;

const RestyledH2 = styled(H2)`
  font-size: 1rem;
  margin: 1rem 0 0 0;
`;

const RestyledListItem = styled(ListItem)`
  align-items: center;
`;

const StyledForm = styled.form`
  width: calc(100% - var(--gap-between));
`;
