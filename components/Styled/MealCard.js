import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import IconButton from "./IconButton";

export default function MealCard({
  recipe,
  isFavorite,
  onToggleIsFavorite,
  numberOfPeople,
  changeNumberOfPeople,
  reassignRecipe,
  removeRecipe,
  day,
}) {
  return (
    <StyledLi>
      {isFavorite !== undefined && (
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
      {reassignRecipe !== undefined && (
        <IconButton
          style="Reload"
          right="-1rem"
          top="1rem"
          onClick={() => {
            reassignRecipe(day);
          }}
        />
      )}
      {removeRecipe !== undefined && (
        <IconButton
          style="x"
          right="-1rem"
          top="4rem"
          onClick={() => {
            removeRecipe(day);
          }}
        />
      )}
      <CardContainer>
        {
          <StyledLink href={`/recipe/${recipe._id}?servings=${numberOfPeople}`}>
            <ImageContainer>
              <StyledImage
                src={
                  recipe.imageLink ||
                  "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"
                }
                alt={`recipe Image ${recipe.title}`}
                sizes="200px"
                fill
              />
            </ImageContainer>
          </StyledLink>
        }
        <StyledDiv>
          <StyledLink href={`/recipe/${recipe._id}?servings=${numberOfPeople}`}>
            <StyledPTitle>{recipe.title}</StyledPTitle>
          </StyledLink>
          <StyledPDuration>
            {recipe.duration} MIN | {recipe.difficulty.toUpperCase()}
          </StyledPDuration>
          {numberOfPeople !== undefined && (
            <NumberOfPeopleContainer>
              <button
                onClick={() => {
                  changeNumberOfPeople(day, -1);
                }}
              >
                ➖
              </button>
              <span>{numberOfPeople}</span>
              <button
                onClick={() => {
                  changeNumberOfPeople(day, +1);
                }}
              >
                ➕
              </button>
              👥
            </NumberOfPeopleContainer>
          )}
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
  objectfit: "cover";
`;

const CardContainer = styled.div`
  background-color: var(--color-component);
  margin: 1.25rem 0 0 0;
  display: flex;
  flex-direction: row;
  border-radius: 20px;
  z-index: 2;
  /* border: black solid 1px; */
  box-shadow: 0px 4px 8px 0 rgb(0 0 0 / 8%);
  text-decoration: none;
  color: var(--darkgrey);
`;

const StyledLink = styled(Link)`
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
  justify-content: center;
  align-items: left;
  width: 210px;
  height: 7.5;
`;

const StyledPTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 0;
  margin-left: 1.5rem;
  margin-top: 0;
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
`;

const NumberOfPeopleContainer = styled.div`
  display: flex;
  gap: 10px;
  width: min-content;
  justify-content: start;
  margin: 0.75rem 0 0 1.5rem;
  font-size: 1.25rem;
  z-index: 3;
  button {
    border: none;
    /* border: 1px solid var(--color-font);
    border-radius: 50%; */
    background: none;
    font-weight: 900;
    font-size: 1.25rem;
    height: 1.5rem;
    width: 1.5rem;
    cursor: pointer;
  }
`;
