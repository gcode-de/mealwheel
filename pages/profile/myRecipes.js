import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import StyledH2 from "@/components/Styled/StyledH2";
import Spacer from "@/components/Styled/Spacer";

import useSWR from "swr";
import styled from "styled-components";

export default function MyRecipes({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const router = useRouter();

  const {
    data: myRecipes,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes?author=${user?._id}`);

  console.log(myRecipes);

  if (error || recipesError || !myRecipes) {
    return (
      <div>
        <Header text={"Meine Rezepte 🥗"} />
        <StyledUl>Keine eigenen Rezepte vorhanden...</StyledUl>
        <IconButton
          onClick={() => {
            router.back();
          }}
          style={"ArrowLeft"}
          left="2rem"
          top="6rem"
        />
      </div>
    );
  }

  if (isLoading || recipesIsLoading) {
    return (
      <>
        <Header text="Meine Rezepte 🥗" />
        <StyledArticle>
          <StyledUl>
            <h2>Lade Rezepte...</h2>
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
        </StyledArticle>
      </>
    );
  }

  return (
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <Spacer />
      <Header text={"Meine Rezepte 🥗"} />
      <StyledArticle>
        <StyledUl>
          {myRecipes?.map((recipe) => {
            return (
              <MealCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                onToggleIsFavorite={toggleIsFavorite}
              ></MealCard>
            );
          })}
        </StyledUl>
      </StyledArticle>
    </>
  );
}

const StyledArticle = styled.article``;

const StyledUl = styled.ul`
  padding: 10px;
  max-width: 350px;
  margin: 0 auto;
`;
