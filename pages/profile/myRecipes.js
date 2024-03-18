import styled from "styled-components";

import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import StyledH2 from "@/components/Styled/StyledH2";
import Spacer from "@/components/Styled/Spacer";
import Link from "next/link";
import CollectionCard from "@/components/CollectionCard";

export default function MyRecipes({
  user,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  recipes,
}) {
  const router = useRouter();
  const myRecipes = recipes?.filter((recipe) => recipe?.author === user?._id);

  if (error) {
    <div>
      <Header text={"schon gekocht 🥗"} />
      Error...
    </div>;
  }

  if (isLoading) {
    return (
      <>
        <Header text="schon gekocht 🥗" />
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
        {user.collections.map((col, index) => (
          <CollectionCard key={index} collection={col} />
        ))}
      </Wrapper>
      <StyledH2>meine Rezepte</StyledH2>
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
  width: calc(100% - (2 * var(--gap-out)));
`;
