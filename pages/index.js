import Header from "@/components/Styled/Header";

import MealCard from "@/components/MealCard";

import StyledUl from "@/components/Styled/StyledUl";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import ScrollToTop from "@/components/ScrollToTopButton";
import StyledH2 from "@/components/Styled/StyledH2";
import Filter from "@/public/icons/sliders-v_10435878.svg";
import Search from "@/public/icons/svg/pan_7409478.svg";
import IconButton from "@/components/Styled/IconButton";
import LoadingComponent from "@/components/Loading";

import { sortingMethods } from "@/helpers/sortingMethods";
import { filterTags } from "@/helpers/filterTags";

import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage({
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  user,
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

  const [currentSort, setCurrentSort] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const { query } = useRouter();

  useEffect(() => {
    if (!query) return;

    function parseUrlParams() {
      const searchFromQuery = query.search || "";
      setSearchTerm(searchFromQuery);
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
      setCurrentSort(newSort);

      const search = query.search || "";

      setFilters(newFilters);
      if (newSort) setCurrentSort(newSort);

      const apiUrl = createUrlWithParams(
        "/api/recipes",
        newFilters,
        newSort,
        search
      );
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
    router.push("/");
  }

  function handleSortChange({ label, type, order }) {
    setCurrentSort({
      label,
      type,
      order,
    });
    applyFilter({ sort: { type, order } });
  }

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  const handleSearch = () => {
    applyFilter({});
  };

  function applyFilter({ filter, sort, search }) {
    const newFilters = filter || filters;
    const newSort = sort || currentSort;
    const currentSearch = search || searchTerm;

    const apiUrlWithFilters = createUrlWithParams(
      "/api/recipes",
      newFilters,
      newSort,
      currentSearch
    );
    setApiQuery(apiUrlWithFilters);

    const browserUrlWithFilters = createUrlWithParams(
      "/",
      newFilters,
      newSort,
      currentSearch
    );
    router.replace(browserUrlWithFilters);
  }

  function createUrlWithParams(
    baseUrl,
    filters = null,
    sort = null,
    search = ""
  ) {
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

    if (search) {
      queryParams.push(`search=${encodeURIComponent(search)}`);
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
          <StyledSearchContainer>
            <input
              type="text"
              placeholder="Suche..."
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
            />
            <button onClick={handleSearch}>
              <Search width="1.25rem" height="1.25rem" />
            </button>
          </StyledSearchContainer>
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

      {recipes.length > 0 ? (
        <>
          <StyledH2>
            {recipes.length === 1
              ? `Ein Rezept gefunden:`
              : `${recipes.length} Rezepte gefunden:`}
          </StyledH2>
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
          {user && (
            <IconButtonLarge
              style={"plus"}
              bottom="6rem"
              onClick={() => router.push("/addRecipe")}
            />
          )}
        </>
      ) : (
        <StyledUl>
          <StyledH2>Keine passenden Rezepte gefunden...</StyledH2>
          <StyledH2>
            <Link href="/">alles zurücksetzen</Link>
          </StyledH2>
        </StyledUl>
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
  top: 2%.75;
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
  position: relative;
`;

const StyledSearchContainer = styled.div`
  max-width: calc(100% - (2 * var(--gap-out)));
  margin: 0.5rem auto 0.5rem auto;
  position: relative;
  display: flex;
  gap: 0.5rem;

  input {
    border: none;
    margin: 1;
    flex: 1;
    border: solid var(--color-darkgrey) 1px;
    border-radius: var(--border-radius-small);
    padding: 0.25rem 0.5rem;
    height: 2rem;
    color: var(--color-darkgrey);
  }
  button {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
  }
`;
