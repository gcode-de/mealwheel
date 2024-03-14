import Header from "@/components/Styled/Header";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import StyledUl from "@/components/StyledUl";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import ScrollToTop from "@/components/ScrollToTopButton";
import { filterTags } from "@/helpers/filterTags";

import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import { useState } from "react";

export default function HomePage({
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
  } = useSWR(`/api/recipes`);
  const router = useRouter();

  const [isFilterButton, setIsFilterButton] = useState(false);

  function toggleFilter() {
    setIsFilterButton(!isFilterButton);
  }

  const [filters, setFilters] = useState(() => {
    return filterTags.reduce((acc, { type }) => {
      acc[type] = [];
      return acc;
    }, {});
  });

  function handleFilterChange(type, value) {
    setFilters((prevFilters) => {
      const isAlreadySelected = prevFilters[type].includes(value);

      if (isAlreadySelected) {
        return {
          ...prevFilters,
          [type]: prevFilters[type].filter((item) => item !== value),
        };
      } else {
        return {
          ...prevFilters,
          [type]: [...prevFilters[type], value],
        };
      }
    });
  }

  function resetCategories() {
    setFilters((prevFilters) => {
      const resetFilters = Object.keys(prevFilters).reduce((acc, key) => {
        acc[key] = [];
        return acc;
      }, {});

      return resetFilters;
    });
  }

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
        <article>
          <StyledUl>
            <h2>Lade Rezepte...</h2>
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
        </article>
      </>
    );
  }

  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <StyledFilterButton onClick={toggleFilter}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          width="20"
          height="20"
        >
          <path d="m4,4.036V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v12.536c0,.276.224.5.5.5s.5-.224.5-.5v-12.536c1.694-.243,3-1.704,3-3.464s-1.306-3.221-3-3.464Zm-.5,5.964c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm9,3.036V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v3.536c0,.276.224.5.5.5s.5-.224.5-.5v-3.536c1.694-.243,3-1.704,3-3.464s-1.306-3.221-3-3.464Zm-.5,5.964c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Zm12-11.5c0-1.76-1.306-3.221-3-3.464V.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v3.536c-1.694.243-3,1.704-3,3.464s1.306,3.221,3,3.464v12.536c0,.276.224.5.5.5s.5-.224.5-.5v-12.536c1.694-.243,3-1.704,3-3.464Zm-3.5,2.5c-1.379,0-2.5-1.121-2.5-2.5s1.121-2.5,2.5-2.5,2.5,1.121,2.5,2.5-1.121,2.5-2.5,2.5Z" />
        </svg>
      </StyledFilterButton>
      {isFilterButton && (
        <>
          <StyledResetButton type="button" onClick={resetCategories}>
            alles zurücksetzen
          </StyledResetButton>
          {filterTags.map(({ label, type, options }) => (
            <div key={type}>
              <StyledH2>{label}</StyledH2>
              <StyledCategoriesDiv>
                {options.map((option) => (
                  <StyledCategoryButton
                    key={option.value}
                    $isActive={filters[type]?.includes(option.value)}
                    onClick={() => handleFilterChange(type, option.value)}
                  >
                    {option.label}
                  </StyledCategoryButton>
                ))}
              </StyledCategoriesDiv>
            </div>
          ))}
        </>
      )}

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

const StyledFilterButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 1rem;
  right: 2rem;
  cursor: pointer;
`;

const StyledResetButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  top: 3.75rem;
  right: 1.5rem;
  font-size: smaller;
  cursor: pointer;
  z-index: 2;
`;

const StyledH2 = styled.h2`
  font-size: small;
  text-align: left;
  width: max-content;
  max-width: calc(100% - (2 * var(--gap-out)));
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  box-sizing: border-box;
  position: relative;
`;

const StyledCategoriesDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: calc(100% - (2 * var(--gap-out)));
  margin: auto;
  margin-top: 0.25rem;
`;

const StyledCategoryButton = styled.button`
  background-color: ${(props) =>
    props.$isActive ? "var(--color-darkgrey)" : "var(--color-component)"};
  color: ${(props) =>
    props.$isActive ? "var(--color-component)" : "var(--color-darkgrey)"};
  border: solid var(--color-darkgrey) 1px;
  border-radius: var(--border-radius-small);
  width: 6rem;
  height: 1.75rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  cursor: pointer;
`;
