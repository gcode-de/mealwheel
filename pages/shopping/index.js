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

import { ingredientUnits } from "@/helpers/ingredientUnits";
import fetchCategorizedIngredients from "@/helpers/OpenAI/CategorizeIngredients";
import updateUserinDb from "@/helpers/updateUserInDb";

import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function ShoppingList({ user, mutateUser }) {
  const [editingIndex, setEditingIndex] = useState("");
  const [isKiGenerating, setIsKiGenerating] = useState(false);
  const editFormRef = useRef(null);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (editFormRef.current && !editFormRef.current.contains(event.target)) {
  //       setEditingIndex(null);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

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

      updateUserinDb(user, mutateUser);
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

  // user.shoppingList = Array.from(
  //   user.shoppingList
  //     .reduce((map, obj) => {
  //       const { id, name, quantity, unit, isChecked } = obj;
  //       const existingObj = map.get(name + unit);
  //       if (existingObj) {
  //         existingObj.quantity += quantity;
  //       } else {
  //         map.set(name + unit, { id, name, quantity, unit, isChecked });
  //       }
  //       return map;
  //     }, new Map())
  //     .values()
  // );

  function consolidateShoppingListItems(userShoppingList) {
    // Iteration über jede Kategorie in der Einkaufsliste
    userShoppingList.forEach((category) => {
      const consolidatedItems = category.items.reduce((map, item) => {
        // Eindeutiger Schlüssel für jedes Item basierend auf Namen und Einheit
        const key = `${item.name}-${item.unit}`;

        if (map.has(key)) {
          const existingItem = map.get(key);
          existingItem.quantity += item.quantity;
        } else {
          map.set(key, { ...item });
        }

        return map;
      }, new Map());

      category.items = Array.from(consolidatedItems.values());
    });
  }

  // consolidateShoppingListItems(user.shoppingList);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);
    if (!user.shoppingList) {
      user.shoppingList = [];
    }
    // user.shoppingList.push({ ...data, isChecked: false });

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

    await updateUserinDb(user, mutateUser);
    event.target.reset();
  }

  // function handleCheckboxChange(category, ind) {
  //   const toggleChecked = user.shoppingList.map((item, index) =>
  //     index === ind ? { ...item, isChecked: !item.isChecked } : item
  //   );
  //   toggleChecked.sort((a, b) => {
  //     if (a.isChecked === b.isChecked) {
  //       return a.index - b.index;
  //     }
  //     return a.isChecked ? 1 : -1;
  //   });
  //   user.shoppingList = toggleChecked;

  //   updateUserinDb(user, mutateUser);

  //   setTimeout(() => {
  //     const deleteChecked = user.shoppingList.filter((item) => !item.isChecked);
  //     user.shoppingList = deleteChecked;
  //     updateUserinDb(user, mutateUser);
  //   }, 10000);
  // }

  function handleCheckboxChange(categoryName, itemIndex) {
    // Finde die Kategorie im Array
    const categoryIndex = user.shoppingList.findIndex(
      (category) => category.category === categoryName
    );
    if (categoryIndex === -1) return; // Kategorie nicht gefunden

    // Kopiere das Kategorieobjekt, um Manipulationen vorzunehmen
    const updatedCategory = { ...user.shoppingList[categoryIndex] };

    // Toggle den isChecked Status des Items
    const item = updatedCategory.items[itemIndex];
    item.isChecked = !item.isChecked;

    // Aktualisiere das Kategorieobjekt in der Liste
    user.shoppingList[categoryIndex] = updatedCategory;

    // Optional: Lösche gecheckte Items nach einer Verzögerung
    setTimeout(() => {
      const uncheckedItems = updatedCategory.items.filter(
        (item) => !item.isChecked
      );
      if (uncheckedItems.length !== updatedCategory.items.length) {
        // Aktualisiere die Kategorie nur, wenn sich die Anzahl der Items geändert hat
        user.shoppingList[categoryIndex].items = uncheckedItems;
        updateUserinDb(user, mutateUser);
      }
    }, 10000);

    updateUserinDb(user, mutateUser);
  }

  function clearShopping() {
    user.shoppingList = [];
    updateUserinDb(user, mutateUser);
  }

  async function setCategories() {
    if (user.shoppingList.length === 0) {
      notifyError("Bitte befülle zuerst deine Einkaufsliste.");
      return;
    }
    setIsKiGenerating(true);
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
    setIsKiGenerating(false);
    updateUserinDb(user, mutateUser);
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
              <h4>{category}</h4>
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
                        onChange={() => {
                          handleCheckboxChange(category, index);
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
        <StyledButton onClick={setCategories}>
          <RotatingSVG $rotate={isKiGenerating} />
          {!isKiGenerating ? "KI-Sortierung" : "bitte warten..."}
        </StyledButton>
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
  margin: 0 auto;
`;
