import styled from "styled-components";
import StyledArticle from "./Styled/DetailArticle";
import IconButton from "./Styled/IconButton";
import StyledList from "./Styled/StyledList";
import { useState } from "react";
import StyledListItem from "./Styled/StyledListItem";
import ChevronSmall from "@/public/icons/ChevronSmall.svg";
import StyledH2 from "./Styled/StyledH2";
import Plus from "@/public/icons/Plus.svg";
import StyledP from "./Styled/StyledP";

export default function RecipeForm() {
  const [isOpen, setIsOpen] = useState(false);

  let ingredients = 2;

  function toggleDropDiffuculty() {
    setIsOpen(!isOpen);
  }
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit}>
      <StyledTop>
        <IconButton style={"x"}></IconButton>
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
            $width={"6rem"}
            required
          ></StyledInput>
          <StyledP>min</StyledP>
          <StyledDropDown
            name="difficulty"
            required
            onClick={() => toggleDropDiffuculty}
          >
            <ChevronSmall width={25} height={25} />
            <StyledP>easy</StyledP>
          </StyledDropDown>
        </StyledListItem>
        <StyledH2>Zutaten</StyledH2>
        <StyledList>
          <StyledListItem>
            <StyledInput
              type="number"
              name="quantity"
              $width={"3rem"}
              required
            ></StyledInput>
            <StyledDropDown required name="unit">
              <ChevronSmall width={25} height={25} /> Einheit
            </StyledDropDown>
            <StyledInput
              type="text"
              name="name"
              placeholder="1. Zutat"
            ></StyledInput>
          </StyledListItem>
          <AddIngredientButton>
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
`;
const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: ${(props) => (props.$width ? props.$width : "100%")};
  flex-grow: ${(props) => props.$flexGrow};
`;

const StyledDropDown = styled.button`
  background-color: transparent;
  border: 1px solid var(--color-lightgrey);
  border-radius: 10px;
  display: flex;
  align-items: center;
`;
const AddIngredientButton = styled.button`
  width: 3rem;
  border: none;
  background-color: var(--color-background);
  border-radius: 10px;
  height: 30px;
  margin-top: 0.5rem;
`;
