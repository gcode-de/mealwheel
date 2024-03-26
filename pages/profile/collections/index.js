import { useRouter } from "next/router";
import { useState } from "react";
import updateUserinDb from "@/helpers/updateUserInDb";

import styled from "styled-components";
import IconButton from "@/components/Styled/IconButton";
import Plus from "@/public/icons/svg/plus.svg";
import CollectionCard from "@/components/Cards/CollectionCard";
import StyledH2 from "@/components/Styled/StyledH2";
import NewCollection from "../../../components/Forms/NewCollection";
import MenuContainer from "@/components/MenuContainer";
import Pen from "/public/icons/svg/pen-square_10435869.svg";
import Trash from "/public/icons/svg/trash-xmark_10741775.svg";
import Check from "@/public/icons/svg/check-circle_10470513.svg";

export default function Collections({ user, mutateUser }) {
  const [addCollection, setAddCollection] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const router = useRouter();
  if (!user) {
    return;
  }

  function toggleAddCollection() {
    setAddCollection(!addCollection);
    setIsMenuVisible(false);
  }
  function toggleMenu() {
    setIsMenuVisible(!isMenuVisible);
  }
  function toggleEdit() {
    setIsEditing(!isEditing);
    setIsMenuVisible(false);
  }
  function handleDeleteCollection() {
    const newCollections = user.collections.filter(
      (collection, index) => !checkedItems.includes(index)
    );
    user.collections = newCollections;

    updateUserinDb(user, mutateUser);
    setIsEditing(false);
  }
  function handleCheckboxChange(index, checked) {
    setCheckedItems((prevItems) =>
      checked
        ? [...prevItems, index]
        : prevItems.filter((item) => item !== index)
    );
  }
  function handleSave(event, index) {
    event.preventDefault();
    const newCollectionName = event.target.value;
    user.collections[index].collectionName = newCollectionName;
    updateUserinDb(user, mutateUser);
    setIsEditing(false);
  }
  return (
    <>
      <Spacer />
      <StyledH2>Kochbücher</StyledH2>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <IconButton
        onClick={toggleMenu}
        right="var(--gap-out)"
        top="var(--gap-out)"
        style="Menu"
        rotate={isMenuVisible}
      />
      {isMenuVisible && (
        <MenuContainer top="3.5rem" right="var(--gap-out)">
          <UnstyledButton onClick={toggleAddCollection}>
            <Plus width={15} height={15} />
            Kochbuch hinzufügen
          </UnstyledButton>
          <UnstyledButton onClick={toggleEdit}>
            <Pen width={15} height={15} />
            Kochbücher bearbeiten
          </UnstyledButton>
        </MenuContainer>
      )}
      {isEditing && (
        <ButtonContainer>
          <button onClick={handleDeleteCollection}>
            <Trash width={15} height={15} />
            entfernen
          </button>
          <button onClick={toggleEdit}>
            <Check width={15} height={15} />
            speichern
          </button>
        </ButtonContainer>
      )}

      {addCollection && (
        <NewCollection
          user={user}
          mutateUser={mutateUser}
          setModal={toggleAddCollection}
        />
      )}
      {!user.collections.length && (
        <NoRecipesMessage>
          Du hast noch keine Kochbücher angelegt.
        </NoRecipesMessage>
      )}
      <CollectionWrapper>
        {user.collections.map((collection, index) => (
          <CollectionContainer key={index}>
            {isEditing && (
              <StyledCheckbox
                type="checkbox"
                onChange={(event) =>
                  handleCheckboxChange(index, event.target.checked)
                }
              />
            )}
            <CollectionCard
              collection={collection}
              isEditing={isEditing}
              handleSave={handleSave}
              index={index}
            ></CollectionCard>
          </CollectionContainer>
        ))}
      </CollectionWrapper>
    </>
  );
}
const CollectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(2 * var(--gap-between));
  margin: auto;
  margin-bottom: 2rem;
  width: calc(100% - (2 * var(--gap-out)));
  position: relative;
`;

const Spacer = styled.div`
  height: 5rem;
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
  margin-bottom: var(--gap-between);

  .button {
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
  }
`;

const StyledCheckbox = styled.input`
  position: absolute;
  z-index: 5;
  top: calc(2 * var(--gap-between));
  left: 0.3rem;
  background-color: var(--color-background);
  margin: 0;
  width: 37px;
  height: 20px;
`;
const CollectionContainer = styled.div`
  position: relative;
`;
const NoRecipesMessage = styled.p`
  width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
`;
