import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import IconButton from "../Styled/IconButton";
import SetNumberOfPeople from "../Styled/SetNumberOfPeople";
import MenuContainer from "./MenuContainer";
import { BookUser, Menu, Reload, Trash } from "@/helpers/svg";
import { useState } from "react";
import ModalComponent from "./Modal";
import AddToCollection from "./Forms/AddToCollection";

export default function MealCard({
  recipe,
  isFavorite,
  onToggleIsFavorite,
  numberOfPeople,
  changeNumberOfPeople,
  reassignRecipe,
  removeRecipe,
  day,
  user,
  weekdays,
  index,
  mutateUser,
}) {
  const [menuVisible, setMenuVisible] = useState(
    weekdays ? new Array(weekdays.length).fill(false) : []
  );
  const [isModalCollection, setIsModalCollection] = useState(false);

  function toggleMenu(index) {
    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = !prevMenuVisible[index];
      return updatedMenuVisible;
    });
  }

  return (
    <StyledLi>
      {isFavorite !== null && (
        <IconButton
          style="Heart"
          right="-0.5rem"
          top="-0.5rem"
          fill={
            isFavorite ? "var(--color-highlight)" : "var(--color-lightgrey)"
          }
          onClick={() => {
            onToggleIsFavorite(recipe._id);
          }}
        />
      )}
      <CardContainer>
        {
          <ImageContainer>
            <StyledImage
              src={
                recipe?.imageLink ||
                "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"
              }
              alt={`recipe Image ${recipe?.title}`}
              sizes="200px"
              fill
            />
          </ImageContainer>
        }
        <StyledDiv>
          <StyledLink
            href={`/recipe/${recipe?._id}?servings=${numberOfPeople}`}
          >
            <StyledPTitle>
              {recipe?.title ? `${recipe?.title}` : "Lade Rezept..."}
            </StyledPTitle>
          </StyledLink>
          <StyledPDuration>
            {recipe?.duration && `${recipe?.duration} MIN | `}
            {recipe?.difficulty?.toUpperCase()}
          </StyledPDuration>
          {weekdays && <StyledDragLine />}
          <StyledSettingsDiv>
            {numberOfPeople !== undefined && (
              <SetNumberOfPeople
                numberOfPeople={numberOfPeople}
                handleChange={(change) => changeNumberOfPeople(change)}
                $margin="0.75rem 0 0 1.5rem"
                reassignRecipe={reassignRecipe}
                day={day}
              />
            )}
            {reassignRecipe !== undefined && (
              <MenuButton>
                <Reload
                  width={20}
                  height={20}
                  onClick={() => {
                    reassignRecipe(day);
                  }}
                />
              </MenuButton>
            )}
            {weekdays && (
              <MenuButton onClick={() => toggleMenu(index)}>
                <StyledMenu width={30} height={30} />
              </MenuButton>
            )}
            {menuVisible[index] && (
              <MenuContainer
                top="6.5rem"
                right="calc(3 * var(--gap-between) + 20px)"
              >
                <UnstyledButton
                  onClick={() => {
                    setIsModalCollection(true);
                    toggleMenu(index);
                  }}
                >
                  <BookUser width={15} height={15} /> Rezept im Kochbuch
                  speichern
                </UnstyledButton>
                <UnstyledButton
                  onClick={() => {
                    removeRecipe(weekdays[index].date);
                  }}
                >
                  <Trash width={15} height={15} />
                  Tag leeren
                </UnstyledButton>
              </MenuContainer>
            )}
            {isModalCollection && (
              <ModalComponent toggleModal={() => setIsModalCollection(false)}>
                <AddToCollection
                  isModalCollection={isModalCollection}
                  setIsModalCollection={setIsModalCollection}
                  user={user}
                  id={recipe._id}
                  mutateUser={mutateUser}
                />
              </ModalComponent>
            )}
          </StyledSettingsDiv>
        </StyledDiv>
      </CardContainer>
    </StyledLi>
  );
}

const ImageContainer = styled.div`
  position: relative;
  width: 123px;
  height: 123px;
`;

const StyledImage = styled(Image)`
  border-radius: 20px 0 0 20px;
  object-fit: cover;
`;

const CardContainer = styled.div`
  background-color: var(--color-component);
  margin-top: calc(2.5 * var(--gap-between));
  margin-bottom: var(--gap-between);
  display: flex;
  flex-direction: row;
  border-radius: 20px;
  z-index: 2;
  box-shadow: 0px 4px 8px 0 rgb(0 0 0 / 8%);
  text-decoration: none;
  color: var(--darkgrey);
`;

const StyledLink = styled(Link)`
  position: relative;
  width: fit-content;
  text-decoration: none;
  color: var(--darkgrey);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: left;
  width: 210px;
  height: 7.5;
  padding: 0.5rem 0 0.5rem 0;
`;

const StyledPTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 0 1.5rem;
  width: fit-content;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Begrenzt den Text auf zwei Zeilen */
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledPDuration = styled.p`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 0;
  margin-left: 1.5rem;
`;

const StyledLi = styled.li`
  list-style-type: none;
  position: relative;
  padding: 0;
`;

const StyledSettingsDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MenuButton = styled.button`
  background-color: var(--color-background);
  border: none;
  z-index: 3;
  border-radius: 50px;
  align-self: end;
  padding-bottom: 0;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledMenu = styled(Menu)`
  rotate: 90deg;
  cursor: pointer;
  border-radius: var(--border-radius-large);
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

const StyledDragLine = styled.div`
  position: absolute;
  right: 0.25rem;
  top: 2.25rem;
  z-index: 3;
  width: 3px;
  box-shadow: inset 0 0 5px rgba(77, 74, 74, 0.2);
  height: 3.25rem;
  border-radius: var(--border-radius-medium);
  background-color: var(--color-background);
`;
