import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import IconButton from "./Styled/IconButton";
import SetNumberOfPeople from "./Styled/SetNumberOfPeople";
import Reload from "@/public/icons/svg/arrows-retweet_9253335.svg";

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
}) {
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
  justify-content: center;
  align-items: left;
  width: 210px;
  height: 7.5;
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

const StyledButtonDiv = styled.div`
  z-index: 2;
  color: var(--color-highlight);
  background-color: var(--color-background);
  border-radius: 10px;
  margin: 0.75rem 0 0 0.25rem;
  button {
    border: none;
    background: none;
    font-size: 1.25rem;
    cursor: pointer;
    position: relative;
    top: 0.15rem;
  }
`;

const StyledSettingsDiv = styled.div`
  display: flex;
`;
