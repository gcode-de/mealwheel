import IconButton from "@/components/Styled/IconButton";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import StyledArticle from "@/components/Styled/DetailArticle";
import StyledList from "@/components/Styled/StyledList";
import StyledH2 from "@/components/Styled/StyledH2";
import StyledP from "@/components/Styled/StyledP";

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
      <ImageContainer
        style={{ position: "relative", width: "400", height: "300px" }}
      >
        <Image
          src={imageLink || "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"}
          alt={`recipe Image ${title}`}
          sizes="500px"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </ImageContainer>
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
        <StyledH2>ingredients</StyledH2>
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

const Wrapper = styled.div`
  margin: auto;
  width: 100%;
  position: relative;
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

const ImageContainer = styled.div`
  position: "relative";
  width: "400";
  height: "300px";
`;

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
`;
