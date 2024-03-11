import AddButton from "@/components/Styled/AddButton";
import Header from "@/components/Styled/Header";
import StyledList from "@/components/Styled/StyledList";
import Plus from "@/public/icons/Plus.svg";
import { useState } from "react";
import StyledIngredients from "@/components/Styled/StyledIngredients";
import StyledInput from "@/components/Styled/StyledInput";
import StyledDropDown from "@/components/Styled/StyledDropDown";
import StyledH2 from "@/components/Styled/StyledH2";

export default function ShoppingList({ user }) {
  const [shoppingItem, setshoppingItem] = useState(
    user ? user.shoppingList : []
  );
  console.log(user);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    setshoppingItem([...shoppingItem, data]);
  }
  console.log(shoppingItem);
  return (
    <>
      <Header text="Einkaufsliste" />
      <StyledList>
        {shoppingItem.map((item, index) => (
          <li key={index}>
            <input type="checkbox"></input>
            <p>{item.quantity}</p>
            <p>{item.unit}</p>
            <p>{item.name}</p>
          </li>
        ))}
      </StyledList>
      <StyledH2>neue Zutat:</StyledH2>
      <form onSubmit={handleSubmit}>
        <StyledList>
          <StyledIngredients>
            <StyledInput
              //   onChange={(event) => handleInputChange(event, index, "quantity")}
              type="number"
              $width={"3rem"}
              required
              min="0"
              aria-label="add ingredient quantity for the recipe"
              name="quantity"
            />
            <StyledDropDown
              required
              name="unit"
              //   onChange={(event) => handleInputChange(event, index, "unit")}
            >
              <option value="">-</option>
              <option value="ml">ml</option>
              <option value="piece">Stück</option>
              <option value="gramm">g</option>
              <option value="EL">EL</option>
              <option value="TL">TL</option>
              <option value="Prise">Prise</option>
            </StyledDropDown>
            <StyledInput
              //   onChange={(event) => handleInputChange(event, index, "name")}
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
