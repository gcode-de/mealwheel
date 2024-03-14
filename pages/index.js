import Header from "@/components/Styled/Header";

import MealCard from "@/components/Styled/MealCard";
import StyledUl from "@/components/StyledUl";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import ScrollToTop from "@/components/ScrollToTopButton";
import Button from "@/components/Styled/StyledButton";
import StyledH2 from "@/components/Styled/StyledH2";
import { filterTags } from "@/helpers/filterTags";
import Filter from "@/public/icons/sliders-v_10435878.svg";
import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import { useState, useEffect } from "react";
import IconButton from "@/components/Styled/IconButton";
import LoadingComponent from "@/components/Loading";

export default function HomePage({
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
}) {
  const router = useRouter();

  const [apiQuery, setApiQuery] = useState(`/api/recipes`);
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

  const { query } = useRouter();

  useEffect(() => {
    if (!query) return;

    function parseUrlParams() {
      const newFilters = Object.keys(filters).reduce((acc, filterType) => {
        if (query[filterType]) {
          acc[filterType] = query[filterType]
            .split(",")
            .map(decodeURIComponent);
        } else {
          acc[filterType] = [];
        }
        return acc;
      }, {});

      setFilters(newFilters);
      const apiUrl = createUrlWithFilters("/api/recipes", newFilters);
      setApiQuery(apiUrl);
    }

    parseUrlParams();
  }, [query]);

  function handleFilterChange(type, value) {
    let newFilters = {};
    const isAlreadySelected = filters[type].includes(value);

    if (isAlreadySelected) {
      newFilters = {
        ...filters,
        [type]: filters[type].filter((item) => item !== value),
      };
    } else {
      newFilters = {
        ...filters,
        [type]: [...filters[type], value],
      };
    }

    applyFilter(newFilters);
  }

  function resetCategories() {
    const currentUrlParams = new URLSearchParams(window.location.search);
    filterTags.forEach(({ type }) => {
      currentUrlParams.delete(type);
    });
    const newUrl = `${window.location.pathname}?${currentUrlParams.toString()}`;
    router.push(newUrl);
  }

  function applyFilter(filters) {
    const url = createUrlWithFilters("/", filters);
    router.push(url);
  }

  function createUrlWithFilters(baseUrl, filters) {
    const queryParams = [];

    Object.entries(filters).forEach(([type, values]) => {
      if (values.length > 0) {
        queryParams.push(`${type}=${values.map(encodeURIComponent).join(",")}`);
      }
    });

    const urlWithFilterParams = `${baseUrl}?${queryParams.join("&")}`;
    return urlWithFilterParams;
  }

  const {
    data: recipes,
    error: recipesError,
    isLoading: recipesIsLoading,
    mutate,
  } = useSWR(apiQuery);

  if (error) {
    return (
      <>
        <Header text={"Meal Wheel 🥗"} />
        <StyledUl>User nicht gefunden...</StyledUl>
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
      <StyledFilterButton onClick={toggleFilter}>
        <Filter width="20" height="20" />
      </StyledFilterButton>
      {isFilterButton && (
        <StyledFiltersContainer>
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
        </StyledFiltersContainer>
      )}

      {!recipesError ? (
        <>
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
      ) : (
        <StyledUl>Keine passenden Rezepte gefunden...</StyledUl>
      )}
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

const StyledFiltersContainer = styled.div`
  margin-bottom: 3rem;
`;
