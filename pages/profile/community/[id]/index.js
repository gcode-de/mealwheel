import { useRouter } from "next/router";
import MealCard from "@/components/Cards/MealCard";
import IconButton from "@/components/Button/IconButton";
import CollectionCard from "@/components/Cards/CollectionCard";
import styled from "styled-components";
import Profile from "@/components/Profile";
import { H2 } from "@/components/Styled/Styled";

export default function DetailCommunityPage({
  allUsers,
  recipes,
<<<<<<< HEAD
  user,
  getRecipeProperty,
  toggleIsFavorite,
=======
  mutateRecipes,
  user,
  mutateUser,
  toggleIsFavorite,
  getRecipeProperty,
  mutateAllUsers,
>>>>>>> main
}) {
  const router = useRouter();
  const { id } = router.query;
  if (!allUsers || !recipes) {
    return;
  }
  const foundUser = allUsers.find((user) => user._id === id);
  const userRecipes = recipes?.filter(
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
      <Profile
        foundUser={foundUser}
        name="external-profil"
        user={user}
        mutateAllUsers={mutateAllUsers}
        allUsers={allUsers}
      />
      <H2>Kochbücher</H2>
      <WrapperFlex>
        {!foundUser.collections.length &&
          `${foundUser.userName} hat noch keine Kochbücher angelegt.`}
      </WrapperFlex>
      <Wrapper>
        {foundUser.collections &&
          foundUser.collections.map((collection, index) => (
            <CollectionCard key={index} collection={collection} />
          ))}
      </Wrapper>
      <H2>Rezepte</H2>

      <StyledUl>
        {userRecipes.length
          ? userRecipes?.map((recipe) => {
              return (
                <MealCard
                  key={recipe._id}
                  recipe={recipe}
                  $isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
                  onToggleIsFavorite={() => {
                    toggleIsFavorite(recipe._id, mutateUser, mutateRecipes);
                  }}
                ></MealCard>
              );
            })
          : `${foundUser.userName} hat noch keine eigenen Rezepte erstellt.`}
      </StyledUl>
    </>
  );
}

const StyledUl = styled.ul`
  padding: 0;
  max-width: 350px;
  margin: 0 auto;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(2 * var(--gap-between));
  margin: auto;
  margin-bottom: 2rem;
  width: calc(100% - (2 * var(--gap-out)));
`;

const WrapperFlex = styled.div`
  width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
`;
