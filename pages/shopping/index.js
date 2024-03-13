import styled from "styled-components";

import StyledList from "@/components/Styled/StyledList";
import AddButton from "@/components/Styled/AddButton";
import Header from "@/components/Styled/Header";
import Plus from "@/public/icons/Plus.svg";
import StyledIngredients from "@/components/Styled/StyledIngredients";
import StyledInput from "@/components/Styled/StyledInput";
import StyledDropDown from "@/components/Styled/StyledDropDown";
import StyledListItem from "@/components/Styled/StyledListItem";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";

import updateUserinDb from "@/helpers/updateUserInDb";

export default function ShoppingList({ user, mutateUser, isLoading }) {
  if (!user) {
    return;
  }
  user.shoppingList = Array.from(
    user.shoppingList
      .reduce((map, obj) => {
        const { name, quantity, unit } = obj;
        const existingObj = map.get(name + unit); // Kombination aus Name und Einheit
        if (existingObj) {
          existingObj.quantity += quantity;
        } else {
          map.set(name + unit, { name, quantity, unit });
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
  }

  function handleCheckboxChange(id) {
    const updatedShoppingList = [...user.shoppingList];
    const itemIndex = updatedShoppingList.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      updatedShoppingList[itemIndex].isChecked =
        !updatedShoppingList[itemIndex].isChecked;
      updatedShoppingList.sort((a, b) => {
        if (a.isChecked === b.isChecked) {
          return a.index - b.index;
        }
        return a.isChecked ? 1 : -1;
      });
      user.shoppingList = updatedShoppingList;

      updateUserinDb(user, mutateUser);

    const checkedItem = updatedShoppingList[itemIndex];
    if (checkedItem.isChecked) {
      setTimeout(() => {
        const updatedShoppingListAfterTimeout = [...user.shoppingList];
        const itemIndexAfterTimeout = updatedShoppingListAfterTimeout.findIndex(item => item.id === itemId);
        if (itemIndexAfterTimeout !== -1) {
          updatedShoppingListAfterTimeout.splice(itemIndexAfterTimeout, 1);
          user.shoppingList = updatedShoppingListAfterTimeout;
          // Entferne das Objekt aus der Datenbank
          updateUserinDb(user, mutateUser);
        }
      }, 5000);
    }
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
                <StyledCheck>
                  <StyledNumberUnit>
                    <StyledCheckItem $flex={0.1}>
                      {item.quantity}
                    </StyledCheckItem>
                    <StyledCheckItem $flex={1}>{item.unit}</StyledCheckItem>
                  </StyledNumberUnit>
                  <StyledCheckItem $flex={2}>{item.name}</StyledCheckItem>
                </StyledCheck>
                <StyledCheckbox
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleCheckboxChange(item.id)}
                ></StyledCheckbox>
              </StyledListItem>
            ))}
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
      <IconButtonLarge style={"trash"} bottom="6rem" onClick="" />
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
