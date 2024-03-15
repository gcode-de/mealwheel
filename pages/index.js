import Header from "@/components/Styled/Header";
import MealCard from "@/components/Styled/MealCard";
import StyledUl from "@/components/StyledUl";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import ScrollToTop from "@/components/ScrollToTopButton";
import StyledH2 from "@/components/Styled/StyledH2";
import Filter from "@/public/icons/sliders-v_10435878.svg";
import IconButton from "@/components/Styled/IconButton";
import LoadingComponent from "@/components/Loading";

import { sortingMethods } from "@/helpers/sortingMethods";
import { filterTags } from "@/helpers/filterTags";

import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import { useState, useEffect } from "react";

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

  const [currentSort, setCurrentSort] = useState();

  const { query } = useRouter();

  useEffect(() => {
    if (!query) return;

    function parseUrlParams() {
      // Extrahiere Filterparameter
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

      // Extrahiere Sortierparameter
      let newSort = null;
      if (query.sort && query.order) {
        newSort = {
          label:
            sortingMethods.find((method) => method.type === query.sort)
              ?.label || query.sort,
          type: query.sort,
          order: query.order,
        };
      }

      // Aktualisiere Zustände basierend auf URL-Parametern
      setFilters(newFilters);
      if (newSort) setCurrentSort(newSort);

      // Erstelle API-URL mit den extrahierten Filtern und Sortierungen
      const apiUrl = createUrlWithParams("/api/recipes", newFilters, newSort);
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

    applyFilter({ filter: newFilters });
  }

  function resetFilters() {
    setFilters((prevFilters) => {
      const resetFilters = Object.keys(prevFilters).reduce((acc, key) => {
        acc[key] = [];
        return acc;
      }, {});

      return resetFilters;
    });
  }

  function handleSortChange({ label, type, order }) {
    setCurrentSort({
      label,
      type,
      order,
    });
    applyFilter({ sort: { type, order } });
  }

  function applyFilter({ filter, sort }) {
    const newFilters = filter || filters;
    const newSort = sort || currentSort;

    const browserUrlWithFilters = createUrlWithParams("/", newFilters, newSort);
    router.push(browserUrlWithFilters);
  }

  function createUrlWithParams(baseUrl, filters = null, sort = null) {
    let apiUrlWithFilters = baseUrl;
    const queryParams = [];

    if (filters) {
      Object.entries(filters).forEach(([type, values]) => {
        if (values.length > 0) {
          queryParams.push(
            `${type}=${values.map(encodeURIComponent).join(",")}`
          );
        }
      });
    }

    if (sort && sort.type && sort.order) {
      queryParams.push(
        `sort=${encodeURIComponent(sort.type)}&order=${encodeURIComponent(
          sort.order
        )}`
      );
    }

    if (queryParams.length > 0) {
      apiUrlWithFilters += `?${queryParams.join("&")}`;
    }

    return apiUrlWithFilters;
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
          <StyledResetButton type="button" onClick={resetFilters}>
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
          <StyledH2>Sortierung</StyledH2>
          <StyledCategoriesDiv>
            {sortingMethods.map((option) => (
              <StyledCategoryButton
                key={option.label}
                $isActive={currentSort?.label === option.label}
                onClick={() =>
                  handleSortChange({
                    label: option.label,
                    type: option.type,
                    order: option.order,
                  })
                }
              >
                {option.label}
              </StyledCategoryButton>
            ))}
          </StyledCategoriesDiv>
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
