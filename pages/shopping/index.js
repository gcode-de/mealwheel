import { useState } from "react";
import useSWR from "swr";
import styled from "styled-components";

import StyledList from "@/components/Styled/StyledList";
import AddButton from "@/components/Styled/AddButton";
import Header from "@/components/Styled/Header";
import Plus from "@/public/icons/Plus.svg";
import StyledIngredients from "@/components/Styled/StyledIngredients";
import StyledInput from "@/components/Styled/StyledInput";
import StyledDropDown from "@/components/Styled/StyledDropDown";
import StyledH2 from "@/components/Styled/StyledH2";
import StyledListItem from "@/components/Styled/StyledListItem";

import updateUserinDb from "@/helpers/updateUserInDb";

export default function ShoppingList({ user, mutateUser }) {
  if (!user) {
    return;
  }

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
  }

  function handleCheckboxChange(index) {
    const updatedShoppingList = [...user.shoppingList];
    updatedShoppingList[index].isChecked =
      !updatedShoppingList[index].isChecked;
    updatedShoppingList.sort((a, b) => (a.isChecked && !b.isChecked ? 1 : -1));
    user.shoppingList = updatedShoppingList;

    updateUserinDb(user, mutateUser);
  }

  return (
    <>
      <Header text="Einkaufsliste" />
      <StyledList>
        {!user.shoppingList
          ? "noch nichts"
          : user.shoppingList.map((item, index) => (
              <StyledListItem
                key={index}
                style={{
                  textDecoration: item.isChecked ? "line-through" : "none",
                }}
              >
                <StyledCheckbox
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                ></StyledCheckbox>
                <StyledCheck>
                  <StyledCheckItem $flex={0.1}>{item.quantity}</StyledCheckItem>
                  <StyledCheckItem $flex={1}>{item.unit}</StyledCheckItem>
                  <StyledCheckItem $flex={2}>{item.name}</StyledCheckItem>
                </StyledCheck>
              </StyledListItem>
            ))}
      </StyledList>
      <StyledH2>neue Zutat:</StyledH2>
      <form onSubmit={handleSubmit}>
        <StyledList>
          <StyledIngredients>
            <StyledInput
              type="number"
              $width={"3rem"}
              required
              min="0"
              aria-label="add ingredient quantity for the recipe"
              name="quantity"
            />
            <StyledDropDown required name="unit">
              <option value="">-</option>
              <option value="ml">ml</option>
              <option value="piece">Stück</option>
              <option value="gramm">g</option>
              <option value="EL">EL</option>
              <option value="TL">TL</option>
              <option value="Prise">Prise</option>
            </StyledDropDown>
            <StyledInput
              type="text"
              name="name"
              placeholder="neues Item"
              aria-label="add igredient name for the recipe"
            />
          </StyledIngredients>
          <AddButton type="submit" $color="var(--color-background)">
            <Plus width={20} height={20} />
          </AddButton>
        </StyledList>
      </form>
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
`;
const StyledCheckbox = styled.input`
  background-color: var(--color-background);
  color: pink;
  height: 20px;
`;
