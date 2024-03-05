import IconButton from "@/components/Styled/IconButton";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";

export default function DetailPage({
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const [content, setContent] = useState("instructions");
  const router = useRouter();
  const { id } = router.query;

  const {
    data: recipe,
    isLoading: dataIsLoading,
    error: dataError,
  } = useSWR(id ? `/api/recipes/${id}` : null);

  if (error || dataError) {
    return <h1>error</h1>;
  }

  if (isLoading || dataIsLoading || !recipe) {
    return <h1>loading recipe...</h1>;
  }

  const {
    _id,
    title,
    instructions,
    imageLink,
    tags,
    youtubeLink,
    ingredients,
    duration,
    difficulty,
  } = recipe;

  difficulty.toUpperCase();

  return (
    <Wrapper>
      <IconButton
        onClick={() => {
          router.back();
        }}
        style={"ArrowLeft"}
        left="0.5rem"
        top="0.5rem"
      />
      <StyledImage
        src={imageLink}
        width={400}
        height={300}
        alt={`recipe Image ${title}`}
        priority
      />
      <StyledArticle>
        <IconButton
          style="Heart"
          right="1rem"
          top="-0.5rem"
          fill={
            getRecipeProperty(_id, "isFavorite")
              ? "var(--color-highlight)"
              : "var(--color-lightgrey)"
          }
          onClick={() => {
            toggleIsFavorite(_id);
          }}
        />
        <h1>{title}</h1>
        <p>
          {duration} MIN | {difficulty}
        </p>
        <Styledh2>ingredients</Styledh2>
        <StyledList>
          {ingredients.map((ingredient) => (
            <StyledListItem key={ingredient._id}>
              <StyledP>{ingredient.name}</StyledP>
              <StyledP>
                {ingredient.quantity} {ingredient.unit}
              </StyledP>
            </StyledListItem>
          ))}
        </StyledList>
        <StyledHyper>
          <StyledLink onClick={() => setContent("instructions")}>
            instructions
          </StyledLink>
          <StyledLink onClick={() => setContent("video")}>video</StyledLink>
        </StyledHyper>
        {content === "instructions" && (
          <StyledIngredients>{instructions}</StyledIngredients>
        )}
        {content === "video" && (
          <Link href={youtubeLink}>see youtube video</Link>
        )}
      </StyledArticle>
    </Wrapper>
  );
}

const StyledArticle = styled.article`
  background-color: var(--color-component);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 40px 40px 0 0;
  padding-left: 3rem;
  padding-right: 3rem;
  position: relative;
  top: -40px;
  z-index: 3;
  padding-bottom: 2rem;
`;
const Wrapper = styled.div`
  margin: auto;
  width: 100%;
  position: relative;
`;
const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 1rem;
  width: 100%;
  border: 1px solid var(--color-lightgrey);
  border-radius: 20px;
`;
const StyledIngredients = styled.article`
  border: 1px solid var(--color-lightgrey);
  border-radius: 20px;
  padding: 1rem;
  margin-top: 1rem;
`;

const StyledHyper = styled.div`
  display: flex;
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-darkgrey);
`;
const StyledLink = styled.button`
  text-decoration: none;
  color: var(--color-font);
  font-size: large;
  font-weight: bold;
  border: none;
  background: none;

  &:hover {
    color: var(--color-highlight);
  }
`;
const StyledImage = styled(Image)`
  position: relative;
  top: 0;
  width: 100%;
`;
const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
`;
const Styledh2 = styled.h2`
  font-size: large;
  text-align: left;
  width: 100%;
`;
const StyledP = styled.p`
  margin: 0;
`;
