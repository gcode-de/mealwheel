import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";

import styled from "styled-components";
import IconButton from "@/components/Styled/IconButton";
import MealCard from "@/components/Cards/MealCard";
import StyledUl from "@/components/Styled/StyledUl";
import Spacer from "@/components/Styled/Spacer";
import StyledH2 from "@/components/Styled/StyledH2";
import Trash from "/public/icons/svg/trash-xmark_10741775.svg";
import Pen from "/public/icons/svg/pen-square_10435869.svg";
import XSmall from "@/public/icons/XSmall.svg";
import MenuContainer from "@/components/MenuContainer";

export default function DetailCollection({
  recipes,
  user,
  mutateUser,
  allUsers,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [foundCollection, setFoundCollection] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    let foundCollection = user.collections.find(
      (collection) => collection._id === id
    );
    const foundUser = allUsers.filter((user) =>
      user.collections.find((collection) => collection._id === id)
    );
    if (!foundCollection) {
      foundCollection = foundUser[0].collections.find(
        (collection) => collection._id === id
      );
    } else {
      setIsUser(true);
    }
    setFoundCollection(foundCollection);
  }, [id, user, recipes, allUsers]);

  if (!user || !recipes) {
    return;
  }
  const foundCollectionIndex = user.collections.findIndex(
    (collection) => collection._id === id
  );

  function toggleEdit() {
    setIsEditing(!isEditing);
    setIsMenuVisible(false);
  }
  function toggleMenu() {
    setIsMenuVisible(!isMenuVisible);
  }
  function handleDeleteRecipes() {
    const newRecipes = foundCollection.recipes.filter(
      (recipe, index) => !checkedItems.includes(index)
    );
    user.collections[foundCollectionIndex].recipes = newRecipes;

    updateUserinDb(user, mutateUser);
  }
  function handleCheckboxChange(index, checked) {
    setCheckedItems((prevItems) =>
      checked
        ? [...prevItems, index]
        : prevItems.filter((item) => item !== index)
    );
  }
  return (
    <>
      <Spacer />
      <StyledH2>{foundCollection?.collectionName} </StyledH2>
      <IconButton
        onClick={() => router.back()}
        left="var(--gap-out)"
        top="var(--gap-out)"
        style="ArrowLeft"
      />
      {isUser && (
        <IconButton
          onClick={toggleMenu}
          right="var(--gap-out)"
          top="var(--gap-out)"
          style="Menu"
          rotate={isMenuVisible}
        />
      )}
      {isMenuVisible && (
        <MenuContainer top="5rem" right="var(--gap-out)">
          <UnstyledButton onClick={toggleEdit}>
            <Pen width={15} height={15} />
            Kochbuch bearbeiten
          </UnstyledButton>
        </MenuContainer>
      )}
      {isEditing && (
        <ButtonContainer>
          <DeleteButton onClick={handleDeleteRecipes}>
            <Trash width={15} height={15} />
            Rezepte entfernen
          </DeleteButton>
          <DeleteButton onClick={toggleEdit}>
            <XSmall width={15} height={15} />
            abbrechen
          </DeleteButton>
        </ButtonContainer>
      )}
      <StyledUl>
        {foundCollection?.recipes.map((recipe, index) => (
          <MealCardContainer key={index}>
            {isEditing && (
              <StyledCheckbox
                type="checkbox"
                onChange={(event) =>
                  handleCheckboxChange(index, event.target.checked)
                }
              />
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

const ButtonContainer = styled.div`
  width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  display: flex;
  justify-content: space-between;
`;
const DeleteButton = styled.button`
  background-color: var(--color-component);

  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  cursor: pointer;
  &:hover {
    background-color: var(--color-background);
  }
`;
