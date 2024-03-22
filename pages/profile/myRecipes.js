import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/MealCard";
import Header from "@/components/Styled/Header";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import Spacer from "@/components/Styled/Spacer";
import BookPlus from "/public/icons/svg/notebook-alt_add.svg";
import { useState } from "react";
import NewCollection from "@/components/Forms/NewCollection";

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
  mutateUser,
}) {
  const [isModalCollection, setIsModalCollection] = useState(false);
  const router = useRouter();

  const {
    data: myRecipes,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes?author=${user?._id}`);

  function toggleAddCollection() {
    setIsModalCollection(!isModalCollection);
  }
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
        <StyledLink href="/profile/collections">alle anzeigen</StyledLink>
      </StyledH2>
      <Wrapper>
        {user.collections.length
          ? user.collections.map((col, index) => (
              <CollectionCard key={index} collection={col} />
            ))
          : `Du hast noch keine Kochbücher angelegt.`}
        <StyledCollection onClick={toggleAddCollection}>
          <BookPlus width={60} height={60} />
          <StyledParagraph />
        </StyledCollection>
        {addCollection && (
          <NewCollection
            user={user}
            mutateUser={mutateUser}
            setModal={toggleAddCollection}
          />
        )}
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
