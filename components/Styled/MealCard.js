import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import IconButton from "./IconButton";

export default function MealCard({ recipe, isFavorite, onToggleIsFavorite }) {
  return (
    <StyledLi>
      <IconButton
        style="Heart"
        right="-0.5rem"
        top="-0.5rem"
        fill={isFavorite ? "var(--color-highlight)" : "var(--color-lightgrey)"}
        onClick={() => {
          onToggleIsFavorite(recipe._id);
        }}
      />
      <StyledLink href={`/recipe/${recipe._id}`}>
        {
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
        }
        <StyledDiv>
          <StyledPTitle>{recipe.title}</StyledPTitle>
          <StyledPDuration>
            {recipe.duration} MIN | {recipe.difficulty.toUpperCase()}
          </StyledPDuration>
        </StyledDiv>
      </StyledLink>
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

const StyledLink = styled(Link)`
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
