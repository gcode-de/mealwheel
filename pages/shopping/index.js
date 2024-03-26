import StyledList from "@/components/Styled/StyledList";
import AddButton from "@/components/Styled/AddButton";
import Header from "@/components/Styled/Header";
import Plus from "@/public/icons/Plus.svg";
import Check from "@/public/icons/svg/check-circle_10470513.svg";
import StyledIngredients from "@/components/Styled/StyledIngredients";
import StyledInput from "@/components/Styled/StyledInput";
import StyledDropDown from "@/components/Styled/StyledDropDown";
import StyledListItem from "@/components/Styled/StyledListItem";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import Button from "@/components/Styled/StyledButton";
import PlateWheel from "/public/icons/svg/plate-wheel.svg";
import StyledH2 from "@/components/Styled/StyledH2";

import { ingredientUnits } from "@/helpers/ingredientUnits";
import fetchCategorizedIngredients from "@/helpers/OpenAI/CategorizeIngredients";
import updateUserInDb from "@/helpers/updateUserInDb";

import styled from "styled-components";
import { useRef, useState } from "react";
import Link from "next/link";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function ShoppingList({ user, mutateUser }) {
  const [editingIndex, setEditingIndex] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const editFormRef = useRef(null);

  function handleItemClick(category, index) {
    setEditingIndex(`${category},${index}`);
  }

  function handleItemEdit(eventTarget, categoryName, itemIndex) {
    const formData = new FormData(eventTarget);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);

    const category = user.shoppingList.find(
      (cat) => cat.category === categoryName
    );

    if (category) {
      const updatedItem = {
        ...category.items[itemIndex],
        ...data,
      };

      category.items[itemIndex] = updatedItem;

      updateUserInDb(user, mutateUser);
      setEditingIndex("");
    } else {
      console.log("Kategorie nicht gefunden.");
    }
  }

  if (!user) {
    return (
      <>
        <Header text="Einkaufsliste" />
        <StyledList>
          Bitte <Link href="/api/auth/signin">einloggen</Link>, um die
          Einkaufsliste zu verwenden.
        </StyledList>
      </>
    );
  }

  function consolidateShoppingListItems(userShoppingList) {
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

  consolidateShoppingListItems(user.shoppingList);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);
    if (!user.shoppingList) {
      user.shoppingList = [];
    }

    const unsortedIndex = user.shoppingList.findIndex(
      (category) => category.category === "Unsortiert"
    );

    if (unsortedIndex !== -1) {
      user.shoppingList[unsortedIndex].items.push({
        ...data,
        isChecked: false,
      });
    } else {
      user.shoppingList.push({
        name: "Unsortiert",
        items: [{ ...data, isChecked: false }],
      });
    }

    await updateUserInDb(user, mutateUser);
    event.target.reset();
  }

  function handleCheckboxChange(categoryName, itemIndex) {
    const categoryIndex = user.shoppingList.findIndex(
      (c) => c.category === categoryName
    );
    if (categoryIndex === -1) {
      console.error("Kategorie nicht gefunden");
      return;
    }

    const newUserShoppingList = [...user.shoppingList];
    newUserShoppingList[categoryIndex].items[itemIndex].isChecked =
      !newUserShoppingList[categoryIndex].items[itemIndex].isChecked;

    updateUserInDb(user, mutateUser);

    setTimeout(async () => {
      const updatedCategories = [...user.shoppingList];
      const updatedItems = updatedCategories[categoryIndex].items.filter(
        (item) => !item.isChecked
      );

      if (updatedItems.length > 0) {
        updatedCategories[categoryIndex].items = updatedItems;
      } else {
        // Entferne die Kategorie, wenn alle Items gecheckt sind
        updatedCategories.splice(categoryIndex, 1);
      }
      user.shoppingList = updatedCategories;

      updateUserInDb(user, mutateUser);
    }, 10000);
  }

  function clearShopping() {
    user.shoppingList = [];
    updateUserInDb(user, mutateUser);
  }

  async function setCategories() {
    if (user.shoppingList.length === 0) {
      notifyError("Bitte befülle zuerst deine Einkaufsliste.");
      return;
    }
    setIsAiGenerating(true);
    try {
      const dataFromAPI = await fetchCategorizedIngredients(
        JSON.stringify(user.shoppingList)
      );
      const parsedData = JSON.parse(dataFromAPI);
      user.shoppingList = await parsedData;
      notifySuccess("Einkaufsliste wurde sortiert.");
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      notifyError("Sortieren fehlgeschlagen.");
    }
    setIsAiGenerating(false);
    updateUserInDb(user, mutateUser);
  }

  return (
    <>
      <Header text="Einkaufsliste" />
      <StyledList>
        {user.shoppingList.length === 0 && (
          <StyledListItem>
            <StyledCheck>nichts zu erledigen</StyledCheck>
          </StyledListItem>
        )}
        {user.shoppingList.map(({ category, items }) =>
          items?.length ? (
            <div key={category}>
              <RestyledH2>{category}</RestyledH2>
              {items.map((item, index) => (
                <StyledListItem
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
                      <StyledInput
                        type="number"
                        defaultValue={item.quantity}
                        min="0"
                        aria-label="edit ingredient quantity for the recipe"
                        name="quantity"
                      />
                      <StyledDropDown name="unit" defaultValue={item.unit}>
                        <option value="">-</option>
                        {ingredientUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </StyledDropDown>
                      <StyledInput
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
                          <StyledCheckItem $text={item.isChecked} $flex={1}>
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
                </StyledListItem>
              ))}
            </div>
          ) : (
            ""
          )
        )}
        <form onSubmit={handleSubmit}>
          <StyledIngredients>
            <StyledInput
              type="number"
              $width={"3rem"}
              min="0"
              aria-label="add ingredient quantity for the recipe"
              name="quantity"
            />
            <StyledDropDown name="unit">
              <option value="">-</option>
              {ingredientUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </StyledDropDown>
            <StyledInput
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
      </StyledList>
      {user.shoppingList.length > 0 && (
        <>
          <StyledButton
            onClick={setCategories}
            aria-label="trigger AI-based sorting and grouping of items (this takes a moment)"
          >
            <RotatingSVG $rotate={isAiGenerating} />
            {!isAiGenerating ? "Sortieren" : "bitte warten..."}
          </StyledButton>
        </>
      )}
      <Spacer />
      <IconButtonLarge style={"trash"} bottom="6rem" onClick={clearShopping} />
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
  gap: 1rem;
`;
const StyledCheckItem = styled.p`
  border-radius: var(--border-radius-small);
  flex-grow: ${(props) => props.$flex};
  text-decoration: ${(props) => (props.$text ? "line-through" : "none")};
`;
const StyledCheckbox = styled.input`
  background-color: var(--color-background);
  margin: 0;
  width: 37px;
  height: 20px;
  z-index: 2;
`;
const StyledNumberUnit = styled.div`
  width: 40%;
  display: flex;
`;
const Spacer = styled.div`
  height: 6rem;
  position: relative;
`;

const StyledEditForm = styled.form`
  display: flex;
  width: 277px;
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

const RestyledH2 = styled(StyledH2)`
  font-size: 1rem;
  margin: 1rem 0 0 0;
`;
