import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import Link from "next/link";
import MealCard from "@/components/Cards/MealCard";
import IconButton from "@/components/Styled/IconButton";
import CollectionCard from "@/components/Cards/CollectionCard";
import StyledH2 from "@/components/Styled/StyledH2";
import styled from "styled-components";
import Profile from "../../../../components/Profile";

export default function DetailCommunityPage({ allUsers, recipes, user }) {
  const router = useRouter();
  const { id } = router.query;
  if (!allUsers || !recipes) {
    return;
  }
  const foundUser = allUsers.find((user) => user._id === id);
  const userRecipes = recipes.filter(
    (recipe) => recipe.author === foundUser._id
  );
  return (
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      <Profile foundUser={foundUser} name="external-profil" user={user} />
      <StyledH2>
        <div>Kochbücher</div>
      </StyledH2>
      <Wrapper>
        {foundUser.collections.length
          ? foundUser.collections.map((collection, index) => (
              <CollectionCard key={index} collection={collection} />
            ))
          : `${foundUser.userName} hat noch keine Kochbücher angelegt.`}
      </Wrapper>
      <StyledH2>
        <div> Rezepte</div>
      </StyledH2>
      <StyledArticle>
        <StyledUl>
          {userRecipes.length
            ? userRecipes?.map((recipe) => {
                return (
                  <MealCard
                    key={recipe._id}
                    recipe={recipe}
                    // isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                    // onToggleIsFavorite={toggleIsFavorite}
                  ></MealCard>
                );
              })
            : `${foundUser.userName} hat noch keine eigenen Rezepte erstellt.`}
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(2 * var(--gap-between));
  margin: auto;
  margin-bottom: 2rem;
  width: calc(100% - (2 * var(--gap-out)));
`;
const StyledCollection = styled.button`
  background-color: transparent;
  border: none;
  color: var(--color-font);
  display: flex;
  flex-direction: column;
  align-items: center;
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  justify-content: center;
  cursor: pointer;
  margin-top: 0;
  margin-bottom: 0;
  height: 6.5rem;
  max-width: 6rem;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;
const StyledParagraph = styled.p`
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  margin-top: var(--gap-between);
  height: 2.5;
`;
