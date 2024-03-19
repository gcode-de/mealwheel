import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import Spacer from "@/components/Styled/Spacer";

import Link from "next/link";
import CollectionCard from "@/components/CollectionCard";
import StyledH2 from "@/components/Styled/StyledH2";

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

  if (error || recipesError || !myRecipes) {
    return (
      <>
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
      </>
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

      <StyledH2>
        <div>Kochbücher</div>
        <StyledLink href="/profile/collections">zeig mir alle</StyledLink>
      </StyledH2>
      <Wrapper>
        {user.collections.length
          ? user.collections.map((col, index) => (
              <CollectionCard key={index} collection={col} />
            ))
          : `Du hast noch keine Kochbücher angelegt.`}
      </Wrapper>
      <StyledH2>Meine Rezepte</StyledH2>
      <StyledArticle>
        <StyledUl>
          {myRecipes.length
            ? myRecipes?.map((recipe) => {
                return (
                  <MealCard
                    key={recipe._id}
                    recipe={recipe}
                    isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                    onToggleIsFavorite={toggleIsFavorite}
                  ></MealCard>
                );
              })
            : "Du hast noch keine eigenen Rezepte erstellt."}
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

const StyledLink = styled(Link)`
  color: var(--color-darkgrey);
  text-decoration: none;
  font-size: medium;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: calc(2 * var(--gap-between));
  margin: auto;
  margin-bottom: 2rem;
  width: calc(100% - (2 * var(--gap-out)));
`;
