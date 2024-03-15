import useSWR from "swr";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/router";

import Header from "@/components/Styled/Header";
import MealCard from "@/components/Styled/MealCard";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import StyledUl from "@/components/StyledUl";
import ScrollToTop from "@/components/ScrollToTopButton";
import LoadingComponent from "@/components/Loading";

export default function HomePage({
  user,
  mutateUser,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  recipes,
  recipesError,
  recipesIsLoading,
}) {
  const router = useRouter();

  if (recipesError || error) {
    return (
      <div>
        <Header text={"Meal Wheel 🥗"} />
        Error...
      </div>
    );
  }

  if (recipesIsLoading || isLoading) {
    return (
      <>
        <Header text={"Meal Wheel 🥗"} />
        <LoadingComponent amount />
      </>
    );
  }

  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <StyledUl>
        {recipes?.map((recipe) => {
          return (
            <MealCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={getRecipeProperty(recipe._id, "isFavorite")}
              onToggleIsFavorite={toggleIsFavorite}
            />
          );
        })}
      </StyledUl>
      <ScrollToTop />
      <IconButtonLarge
        style={"plus"}
        bottom="6rem"
        onClick={() => router.push("/addRecipe")}
      />
    </>
  );
}
