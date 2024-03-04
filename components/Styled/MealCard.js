import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function MealCard({ recipe }) {
  return (
    <StyledLink href={`/recipe/${recipe._id}`}>
      <StyledCard>
        <StyledImage
          src={recipe.imageLink}
          alt={recipe.title}
          height={123}
          width={123}
        />
        <StyledDiv>
          <StyledPTitle>{recipe.title}</StyledPTitle>
          <StyledPDuration>
            {recipe.duration} MIN | {recipe.difficulty.toUpperCase()}
          </StyledPDuration>
        </StyledDiv>
      </StyledCard>
    </StyledLink>
  );
}

const StyledImage = styled(Image)`
  border-radius: 20px 0 0 20px;
`;

const StyledCard = styled.li`
  background-color: var(--color-component);
  list-style-type: none;
  margin: 1.25rem 0 0 0;
  display: flex;
  flex-direction: row;
  border-radius: 20px;
  z-index: 2;
  /* border: black solid 1px; */
  box-shadow: 0px 4px 8px 0 rgb(0 0 0 / 25%);
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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--darkgrey);
`;
