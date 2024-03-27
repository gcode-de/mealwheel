import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { notifySuccess, notifyError } from "/helpers/toast";

import assignRecipesToCalendarDays from "@/helpers/assignRecipesToCalendarDays";
import updateUserinDb from "@/helpers/updateUserInDb";
import { filterTags } from "@/helpers/filterTags";

import SetNumberOfPeople from "@/components/Cards/SetNumberOfPeople";
import IconButton from "@/components/Styled/IconButton";
import StyledArticle from "@/components/Styled/StyledArticle";
import StyledList from "@/components/Styled/StyledList";
import StyledH2 from "@/components/Styled/StyledH2";
import StyledP from "@/components/Styled/StyledP";
import StyledListItem from "@/components/Styled/StyledListItem";
import LoadingComponent from "@/components/Loading";
import StyledDropDown from "@/components/Styled/StyledDropDown";
import Notes from "@/components/Notes";
import MenuContainer from "@/components/MenuContainer";
import Calendar from "@/public/icons/svg/calendar-days_9795297.svg";
import Pen from "/public/icons/svg/pen-square_10435869.svg";
import Book from "@/public/icons/svg/notebook-alt_9795395.svg";
import ModalComponent from "../../../components/Modal";

export default function DetailPage({
  user,
  mutateUser,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  toggleHasCooked,
}) {
  const [content, setContent] = useState("instructions");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [calendarFormIsVisible, setCalendarFormIsVisible] = useState(false);
  const [collectionFormIsVisible, setCollectionFormIsVisible] = useState(false);
  const [selectedCollection, setselectedCollection] = useState(
    user?.collections?.[0]?.collectionName || ""
  );
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalCalendar, setIsModalCalendar] = useState(false);
  const [isModalCollection, setIsModalCollection] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const {
    data: recipe,
    isLoading: dataIsLoading,
    error: dataError,
    mutate: mutateRecipe,
  } = useSWR(id ? `/api/recipes/${id}` : null);

  const defaultNumberOfServings = recipe?.defaultNumberOfServings;

  const [servings, setServings] = useState(
    Number(router?.query?.servings) || defaultNumberOfServings || 2
  );

  if (error || dataError) {
    return <h1>Fehler beim Laden des Rezepts...</h1>;
  }

  if (isLoading || dataIsLoading || !recipe) {
    return <LoadingComponent />;
  }

  const {
    _id,
    title,
    instructions,
    imageLink,
    diet,
    mealtype,
    youtubeLink,
    ingredients,
    duration,
    difficulty,
    author,
    likes,
  } = recipe;

  difficulty.toUpperCase();
  const userIsAuthor = user && user?._id === author;
  function toggleMenu() {
    setIsMenuVisible(!isMenuVisible);
  }
  const handleAssignRecipeToCalendar = async (event) => {
    event.preventDefault();

    // Generieren des ISO-Datums
    const isoDate = new Date(selectedDate);
    isoDate.setUTCHours(0, 0, 0, 0);
    const dbDate = isoDate.toISOString();
    try {
      const assignment = [
        {
          date: dbDate,
          recipe: id,
          servings: servings,
        },
      ];

      await assignRecipesToCalendarDays(assignment, user, mutateUser);

      const localDate = new Date(dbDate).toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setCalendarFormIsVisible(false);
      notifySuccess(`Das Rezept wurde für ${localDate} eingeplant.`);
    } catch (error) {
      notifyError("Das Rezept konnte nicht eingeplant werden.");
    }
  };

  async function handleCollection(event) {
    event.preventDefault();
    const isDuplicate = user.collections
      .find((col) => col.collectionName === selectedCollection)
      .recipes.find((recipe) => recipe._id === id);
    if (isDuplicate) {
      notifyError("Dieses Rezept ist bereits gespeichert.");
      return;
    }

    const updateCollection = user.collections.map((col) =>
      col.collectionName === selectedCollection
        ? { ...col, recipes: [...col.recipes, id] }
        : col
    );
    user.collections = updateCollection;
    try {
      updateUserinDb(user, mutateUser);
      setCollectionFormIsVisible(false);
      notifySuccess(`Das Rezept wurde gespeichert.`);
    } catch (error) {
      notifyError("Das Rezept konnte nicht gespeichert werden.");
    }
  }

  function handleSetNumberOfPeople(change) {
    const newServings = servings + change;
    setServings(newServings);

    const newQuery = {
      ...router.query,
      servings: newServings,
    };

    const queryString = new URLSearchParams(newQuery).toString();
    router.replace(`${router.pathname}?${queryString}`, undefined, {
      shallow: true,
    });
  }

  function handleAddNote(event) {
    event.preventDefault();
    if (!user) {
      notifyError("Bitte zuerst einloggen.");
      return;
    }
    const formData = new FormData(event.target);
    const note = {
      comment: formData.get("comment"),
      date: new Date(),
    };
    getRecipeProperty(_id, "notes");

    const interactionIndex = user.recipeInteractions.findIndex(
      (interaction) => interaction.recipe._id === _id
    );

    if (interactionIndex !== -1) {
      user.recipeInteractions[interactionIndex].notes.push(note);
    } else {
      user.recipeInteractions.push({ _id: _id, notes: [note] });
    }
    updateUserinDb(user, mutateUser);
    event.target.reset();
    mutate();
  }

  const foundInteractions = user?.recipeInteractions?.find(
    (interaction) => interaction.recipe._id === _id
  );
  function toggleModalCalender() {
    setIsModalCalendar(!isModalCalendar);
    setIsMenuVisible(false);
  }
  function toggleModalCollection() {
    setIsModalCollection(!isModalCollection);
    setIsMenuVisible(false);
  }

  return (
    <Wrapper>
      <IconButton
        onClick={() => {
          router.back();
        }}
        style={"ArrowLeft"}
        left="0.5rem"
        top="0.5rem"
      />
      <ImageContainer
        src={imageLink || "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"}
        alt={`recipe Image ${title}`}
        width={400}
        height={400}
        sizes="500px"
      />
      <StyledArticle>
        <IconButton
          style="Pot"
          right="calc(2*3rem + var(--gap-out))"
          top="-1.25rem"
          fill={
            getRecipeProperty(_id, "hasCooked")
              ? "var(--color-highlight)"
              : "var(--color-lightgrey)"
          }
          onClick={() => {
            if (!user) {
              notifyError("Bitte zuerst einloggen.");
              return;
            }
            toggleHasCooked(_id);
          }}
        />
        <IconButton
          style="Heart"
          right="calc(3rem + var(--gap-out))"
          top="-1.25rem"
          fill={
            getRecipeProperty(_id, "isFavorite")
              ? "var(--color-highlight)"
              : "var(--color-lightgrey)"
          }
          onClick={() => {
            if (!user) {
              notifyError("Bitte zuerst einloggen.");
              return;
            }
            toggleIsFavorite(_id, mutateRecipe);
          }}
        />
        <IconButton
          onClick={toggleMenu}
          right="var(--gap-out)"
          top="-1.25rem"
          style="Menu"
          rotate={isMenuVisible}
        />
        {isMenuVisible && (
          <MenuContainer top="2rem" right="var(--gap-out)">
            <UnstyledButton onClick={toggleModalCalender}>
              <Calendar width={15} height={15} />
              Rezept im Kalender speichern
            </UnstyledButton>
            <UnstyledButton onClick={toggleModalCollection}>
              <Book width={15} height={15} />
              Rezept im Kochbuch speichern
            </UnstyledButton>
            {userIsAuthor && (
              <UnstyledButton onClick={() => router.push(`/recipe/${id}/edit`)}>
                <Pen width={15} height={15} />
                Rezept bearbeiten
              </UnstyledButton>
            )}
          </MenuContainer>
        )}
        {isModalCalendar && (
          <ModalComponent toggleModal={toggleModalCalender}>
            <StyledForm onSubmit={handleAssignRecipeToCalendar}>
              <h3>Dieses Rezept einplanen:</h3>
              <label htmlFor="date">Datum:</label>
              <input
                type="date"
                name="date"
                value={selectedDate}
                required
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                }}
              />
              <button type="submit">speichern</button>
            </StyledForm>
          </ModalComponent>
        )}
        {isModalCollection && (
          <ModalComponent toggleModal={toggleModalCollection}>
            <StyledForm
              onSubmit={handleCollection}
              $isVisible={collectionFormIsVisible}
            >
              <h3>Dieses Rezept speichern:</h3>
              <StyledDropDown
                onChange={(event) => setselectedCollection(event.target.value)}
                name="collectionName"
                required
              >
                {user?.collections.map((col, index) => (
                  <option key={index} value={col.collectionName}>
                    {col.collectionName}
                  </option>
                ))}
              </StyledDropDown>

              <button type="submit">speichern</button>
            </StyledForm>
          </ModalComponent>
        )}

        <StyledTitle>{title}</StyledTitle>
        <StyledP>
          {duration} MIN | {difficulty} |{" "}
          {recipe.likes &&
            `${recipe.likes} ${recipe.likes > 1 ? "Schmeckos" : "Schmecko"}`}
        </StyledP>
        <StyledH2>
          Zutaten{" "}
          <SetNumberOfPeople
            numberOfPeople={servings}
            handleChange={handleSetNumberOfPeople}
            $margin="-0.4rem 0 0 0"
          />
        </StyledH2>
        <StyledList>
          {ingredients.map((ingredient) => (
            <StyledListItem key={ingredient._id}>
              <StyledP>{ingredient.name}</StyledP>
              <StyledP>
                {ingredient.quantity * servings} {ingredient.unit}
              </StyledP>
            </StyledListItem>
          ))}
        </StyledList>
        <StyledCategoriesDiv>
          <div>
            {filterTags
              .filter(({ type }) => type === "diet")
              .map(({ label, type }) => (
                <RestyledH2 key={type}>{label}</RestyledH2>
              ))}
            {diet?.map((tag) => {
              const filterTag = filterTags.find(
                (filter) => filter.type === "diet"
              );
              const matchingOption = filterTag.options.find(
                (option) => option.value === tag
              );
              return (
                <StyledCategoryButton key={tag}>
                  {matchingOption ? matchingOption.label : tag}
                </StyledCategoryButton>
              );
            })}
          </div>
          <div>
            {filterTags
              .filter(({ type }) => type === "mealtype")
              .map(({ label, type }) => (
                <RestyledH2 key={type}>{label}</RestyledH2>
              ))}
            {mealtype?.map((tag) => {
              const filterTag = filterTags.find(
                (filter) => filter.type === "mealtype"
              );
              const matchingOption = filterTag.options.find(
                (option) => option.value === tag
              );
              return (
                <StyledCategoryButton key={tag}>
                  {matchingOption ? matchingOption.label : tag}
                </StyledCategoryButton>
              );
            })}
          </div>
        </StyledCategoriesDiv>
        <StyledHyper>
          <StyledLink onClick={() => setContent("instructions")}>
            Zubereitung
          </StyledLink>
          <StyledLink
            onClick={() => {
              if (!user) {
                notifyError("Bitte zuerst einloggen.");
                return;
              }
              setContent("notes");
            }}
          >
            Notizen
          </StyledLink>
        </StyledHyper>
        {content === "instructions" && (
          <StyledIngredients>{instructions}</StyledIngredients>
        )}
        {content === "notes" && (
          <Notes
            user={user}
            _id={id}
            mutateUser={mutateUser}
            foundInteractions={foundInteractions}
          />
        )}
      </StyledArticle>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: auto;
  width: 100%;
  position: relative;
`;

const StyledIngredients = styled.article`
  border: 1px solid var(--color-lightgrey);
  border-radius: 20px;
  padding: 1rem;
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  width: calc(100% - (2 * var(--gap-out)));
`;

const StyledHyper = styled.div`
  display: flex;
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  width: calc(100% - (2 * var(--gap-out)));
  justify-content: space-between;
  border-bottom: 1px solid var(--color-darkgrey);
`;
const StyledLink = styled.button`
  text-decoration: none;
  color: var(--color-font);
  font-size: large;
  font-weight: bold;
  border: none;
  background: none;

  &:hover {
    color: var(--color-highlight);
  }
`;

const ImageContainer = styled(Image)`
  position: relative;
  width: 100%;
  height: auto;
`;

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: space-between;
  transition: opacity 0.3s ease-in-out, margin 0.2s ease-out;
  overflow: hidden;
  h3 {
    flex-basis: 100%;
    margin: 0;
  }
  label {
  }
  button {
    width: 80px;
    line-height: 1.1rem;
    padding: 0.4rem 0.5rem;
    min-height: 2rem;
    border: none;
    border-radius: 10px;
    background-color: var(--color-darkgrey);
    color: var(--color-background);
    cursor: pointer;
    margin-right: auto;
  }
  input {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 10px;
    background-color: var(--color-background);
    min-height: 2rem;
  }
`;
const StyledTitle = styled.h1`
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: calc(100% - (2 * var(--gap-out)));
  text-align: center;
`;

const StyledCategoriesDiv = styled.div`
  display: flex;
  justify-content: left;
  gap: calc(2 * var(--gap-between));
  flex-wrap: wrap;
  width: calc(100% - (2 * var(--gap-out)));
  margin: 0;
  margin-top: 0.25rem;
  div:first-child {
    position: relative;
    margin-right: var(--gap-between);
  }
  div:first-child::after {
    content: "";
    position: absolute;
    right: calc(-1 * var(--gap-between));
    top: 25%;
    bottom: 25%;
    width: 1px;
    background-color: black;
  }
`;

const StyledCategoryButton = styled.button`
  background-color: var(--color-component);
  color: var(--color-darkgrey);
  border: solid var(--color-darkgrey) 1px;
  border-radius: var(--border-radius-small);
  width: 6rem;
  height: 1.75rem;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
`;
const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  &:hover {
    background-color: var(--color-background);
  }
`;

const RestyledH2 = styled(StyledH2)`
  margin-left: 0;
`;
