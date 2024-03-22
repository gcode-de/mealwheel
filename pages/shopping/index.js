import styled from "styled-components";
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
import Link from "next/link";
import { ingredientUnits } from "@/helpers/ingredientUnits";

import updateUserinDb from "@/helpers/updateUserInDb";
import { useEffect, useRef, useState } from "react";

import fetchCategorizedIngredients from "@/helpers/OpenAI/CategorizeIngredients";
export default function ShoppingList({ user, mutateUser }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const editFormRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (editFormRef.current && !editFormRef.current.contains(event.target)) {
        setEditingIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleItemClick(index) {
    setEditingIndex(index);
  }

  function handleItemEdit(event, index) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);

    const updatedList = [...user.shoppingList];
    updatedList[index] = { ...data, isChecked: updatedList[index].isChecked };

    user.shoppingList = updatedList;
    updateUserinDb(user, mutateUser);
    setEditingIndex(null);
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

  user.shoppingList = Array.from(
    user.shoppingList
      .reduce((map, obj) => {
        const { id, name, quantity, unit, isChecked } = obj;
        const existingObj = map.get(name + unit);
        if (existingObj) {
          existingObj.quantity += quantity;
        } else {
          map.set(name + unit, { id, name, quantity, unit, isChecked });
        }
        return map;
      }, new Map())
      .values()
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    data.quantity = Number(data.quantity);
    if (!user.shoppingList) {
      user.shoppingList = [];
    }
    user.shoppingList.push({ ...data, isChecked: false });

    await updateUserinDb(user, mutateUser);
    event.target.reset();
  }

  function handleCheckboxChange(ind) {
    const toggleChecked = user.shoppingList.map((item, index) =>
      index === ind ? { ...item, isChecked: !item.isChecked } : item
    );
    toggleChecked.sort((a, b) => {
      if (a.isChecked === b.isChecked) {
        return a.index - b.index;
      }
      return a.isChecked ? 1 : -1;
    });
    user.shoppingList = toggleChecked;

    updateUserinDb(user, mutateUser);

    setTimeout(() => {
      const deleteChecked = user.shoppingList.filter((item) => !item.isChecked);
      user.shoppingList = deleteChecked;
      updateUserinDb(user, mutateUser);
    }, 10000);
  }

  function clearShopping() {
    user.shoppingList = [];
    updateUserinDb(user, mutateUser);
  }

  async function setCategories() {
    console.log("list-object", user.shoppingList);
    const itemsAsString = user.shoppingList
      .map((item) => {
        return `${item.name} (${item.quantity} ${item.unit})`;
      })
      .join(", ");
    console.log("Eingabe:", itemsAsString);
    const categories = fetchCategorizedIngredients(itemsAsString);
    console.log("Ausgabe:", await categories);
  }
  return (
    <>
      <Header text="Einkaufsliste" />
      <StyledList>
        {user.shoppingList.length === 0 ? (
          <StyledListItem>
            <StyledCheck>nichts zu erledigen</StyledCheck>
          </StyledListItem>
        ) : (
          user.shoppingList.map((item, index) => (
            <StyledListItem key={index} onClick={() => handleItemClick(index)}>
              {editingIndex === index ? (
                <StyledEditForm
                  ref={editFormRef}
                  onSubmit={(event) => handleItemEdit(event, index)}
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
                    onChange={() => handleCheckboxChange(index)}
                  ></StyledCheckbox>
                </>
              )}
            </StyledListItem>
          ))
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
      <Spacer />
      <IconButtonLarge
        style={"generate"}
        bottom="10rem"
        onClick={setCategories}
      />
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
