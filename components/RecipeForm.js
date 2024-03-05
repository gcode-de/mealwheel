import styled from "styled-components";
import StyledArticle from "./Styled/DetailArticle";
import IconButton from "./Styled/IconButton";
import StyledList from "./Styled/StyledList";
import { useState } from "react";
import StyledListItem from "./Styled/StyledListItem";
import StyledH2 from "./Styled/StyledH2";
import Plus from "@/public/icons/Plus.svg";
import StyledP from "./Styled/StyledP";
import { useRouter } from "next/router";

export default function RecipeForm({ onSubmit }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [ingredients, setIngredients] = useState([
    {
      quantity: "",
      unit: "",
      name: "",
    },
  ]);
  const router = useRouter();
  function handleInputChange(event, index, field) {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = event.target.value;
    setIngredients(newIngredients);
  }
  function addIngredient() {
    setIngredients([
      ...ingredients,
      {
        quantity: "",
        unit: "",
        name: "",
      },
    ]);
  }
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    onSubmit(data);
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit}>
      <StyledTop>
        <IconButton
          style={"x"}
          onClick={() => {
            router.back();
          }}
        ></IconButton>
      </StyledTop>
      <StyledArticle>
        <StyledBigInput
          type="text"
          name="title"
          placeholder="Titel"
          required
        ></StyledBigInput>
        <StyledListItem>
          <StyledInput
            type="number"
            name="duration"
            placeholder="Dauer"
            $width={"5rem"}
            required
          ></StyledInput>
          <StyledP>min</StyledP>

          <StyledDropDown
            onChange={(e) => setDifficulty(e.target.value)}
            value={difficulty}
            name="difficulty"
            required
          >
            <option value="easy">Anfänger</option>
            <option value="advanced">Fortgeschritten</option>
            <option value="chef">Profi</option>
          </StyledDropDown>
        </StyledListItem>
        <StyledH2>Zutaten</StyledH2>
        <StyledList>
          {ingredients.map((ingredient, index) => (
            <StyledListItem key={index}>
              <StyledInput
                value={ingredient.quantity}
                onChange={(e) => handleInputChange(e, index, "quantity")}
                type="number"
                name={`quantity-${index}`}
                $width={"3rem"}
                required
              ></StyledInput>
              <StyledDropDown required name={`unit-${index}`}>
                <option value="ml">ml</option>
                <option value="piece">Stück</option>
                <option value="gramm">g</option>
                <option value="EL">EL</option>
                <option value="TL">TL</option>
                <option value="Prise">Prise</option>
              </StyledDropDown>
              <StyledInput
                // value={ingredient.name}
                type="text"
                name={`name-${index}`}
                placeholder={`${index + 1}. Zutat`}
              ></StyledInput>
            </StyledListItem>
          ))}
          <AddIngredientButton type="button" onClick={addIngredient}>
            <Plus width={20} height={20} />
          </AddIngredientButton>
        </StyledList>
        <StyledH2>Anleitung</StyledH2>
        <StyledBigInput
          type="text"
          name="instruction"
          required
        ></StyledBigInput>
        <StyledH2>Video</StyledH2>
        <StyledInput type="link" name="youtubeLink"></StyledInput>
        <button type="submit">speichern</button>
      </StyledArticle>
    </form>
  );
}

const StyledTop = styled.div`
  height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledBigInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  padding: 0.5rem;
`;
const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: ${(props) => (props.$width ? props.$width : "100%")};
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.5rem;
`;

const StyledDropDown = styled.select`
  background-color: transparent;
  border: 1px solid var(--color-lightgrey);
  border-radius: 10px;
  display: flex;
  height: 30px;
  align-items: center;
`;
const AddIngredientButton = styled.button`
  width: 3rem;
  border: none;
  background-color: var(--color-background);
  border-radius: 10px;
  height: 30px;
`;
