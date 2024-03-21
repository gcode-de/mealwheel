import IconButton from "@/components/Styled/IconButton";
import MealCard from "@/components/MealCard";
import { useRouter } from "next/router";
import StyledUl from "@/components/Styled/StyledUl";
import Spacer from "@/components/Styled/Spacer";
import StyledH2 from "@/components/Styled/StyledH2";
import { useState } from "react";
import styled from "styled-components";
import MenuContainer from "../../../components/Styled/MenuContainer";
import Trash from "/public/icons/svg/trash-xmark_10741775.svg";

export default function DetailCollection({ recipes, user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  if (!user || !recipes) {
    return;
  }
  useE;
  const foundCollection = user.collections.find((col) => col._id === id);
  setCheckedItems(new Array(foundCollection.recipes.length).fill(false));

  function toggleEdit() {
    setIsEditing(!isEditing);
    setMenuVisible(false);
  }
  function toggleMenu() {
    setMenuVisible(!menuVisible);
  }
  function handleDeleteRecipes() {
    console.log("lösch mich");
  }
  function handleCheckboxChange(index) {
    setCheckedItems((prevItems) => ({
      ...prevItems,
      [index]: !prevItems[index],
    }));
    console.log(checkedItems);
  }
  return (
    <>
      <Spacer />
      <StyledH2>{foundCollection.collectionName} </StyledH2>
      <IconButton
        onClick={() => router.back()}
        left="var(--gap-out)"
        top="var(--gap-out)"
        style="ArrowLeft"
      />
      <IconButton
        onClick={toggleMenu}
        right="var(--gap-out)"
        top="var(--gap-out)"
        style="Menu"
      />
      {menuVisible && (
        <MenuContainer>
          <UnstyledButton onClick={toggleEdit}>
            <Trash width={15} height={15} />
            Rezepte aus Kochbuch löschen
          </UnstyledButton>
        </MenuContainer>
      )}
      {isEditing && (
        <button onClick={handleDeleteRecipes}>
          lösche ausgewählte Rezepte aus dem Kochbuch
        </button>
      )}
      <StyledUl>
        {foundCollection.recipes.map((recipe, index) => (
          <MealCardContainer key={index}>
            {isEditing && (
              <>
                <StyledCheckbox
                  type="checkbox"
                  checked={!!checkedItems[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </>
            )}
            <MealCard recipe={recipe} />
          </MealCardContainer>
        ))}
      </StyledUl>
    </>
  );
}
const StyledCheckbox = styled.input`
  position: absolute;
  z-index: 2;
  top: calc(2 * var(--gap-between));
  left: var(--gap-between);
  background-color: var(--color-background);
  margin: 0;
  width: 37px;
  height: 20px;
`;
const MealCardContainer = styled.div`
  position: relative;
`;
const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  &:hover {
    background-color: var(--color-background);
  }
`;
