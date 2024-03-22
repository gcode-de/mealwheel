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

import SetNumberOfPeople from "@/components/Styled/SetNumberOfPeople";
import IconButton from "@/components/Styled/IconButton";
import StyledArticle from "@/components/Styled/StyledArticle";
import StyledList from "@/components/Styled/StyledList";
import StyledH2 from "@/components/Styled/StyledH2";
import StyledP from "@/components/Styled/StyledP";
import StyledListItem from "@/components/Styled/StyledListItem";
import LoadingComponent from "@/components/Loading";
import StyledDropDown from "@/components/Styled/StyledDropDown";
import Notes from "@/components/Notes";

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
  const [selectedDate, setSelectedDate] = useState("");
  const [calendarFormIsVisible, setCalendarFormIsVisible] = useState(false);
  const [collectionFormIsVisible, setCollectionFormIsVisible] = useState(false);
  const [selectedCollection, setselectedCollection] = useState(
    user?.collections?.[0]?.collectionName || ""
  );

  const router = useRouter();
  const { id } = router.query;

  const {
    data: recipe,
    isLoading: dataIsLoading,
    error: dataError,
    mutate,
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
    youtubeLink,
    ingredients,
    duration,
    difficulty,
    author,
  } = recipe;

  difficulty.toUpperCase();
  const userIsAuthor = user && user?._id === author;

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
        {userIsAuthor && (
          <Link href={`/recipe/${id}/edit`}>
            <IconButton
              style="Edit"
              right="14.25rem"
              top="-1.25rem"
              fill={"var(--color-lightgrey)"}
            />
          </Link>
        )}
        <IconButton
          style="Book"
          right="11.25rem"
          top="-1.25rem"
          fill={
            collectionFormIsVisible
              ? "var(--color-highlight)"
              : "var(--color-lightgrey)"
          }
          onClick={() => {
            if (!user) {
              notifyError("Bitte zuerst einloggen.");
              return;
            }
            setCollectionFormIsVisible((prevState) => !prevState);
            setCalendarFormIsVisible(false);
          }}
        />
        <IconButton
          style="Calendar"
          right="8.25rem"
          top="-1.25rem"
          fill={
            calendarFormIsVisible
              ? "var(--color-highlight)"
              : "var(--color-lightgrey)"
          }
          onClick={() => {
            if (!user) {
              notifyError("Bitte zuerst einloggen.");
              return;
            }
            setCalendarFormIsVisible((prevState) => !prevState);
            setCollectionFormIsVisible(false);
          }}
        />
        <IconButton
          style="Pot"
          right="5.25rem"
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
          right="2.25rem"
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
            toggleIsFavorite(_id);
          }}
        />
        <StyledForm
          onSubmit={handleAssignRecipeToCalendar}
          $isVisible={calendarFormIsVisible}
        >
          <h3>Rezept einplanen:</h3>
          <label htmlFor="date">Datum:</label>
          <input
            type="date"
            name="date"
            value={selectedDate || new Date().toISOString().split("T")[0]}
            required
            onChange={(event) => {
              setSelectedDate(event.target.value);
            }}
          />
          <button type="submit">speichern</button>
        </StyledForm>
        <StyledForm
          onSubmit={handleCollection}
          $isVisible={collectionFormIsVisible}
        >
          <h3>Rezept in Kochbuch speichern:</h3>
          <StyledDropDown
            onChange={(event) => setselectedCollection(event.target.value)}
            name="collectionName"
            required
          >
            <option>Kochbuch wählen</option>
            {user?.collections.map((col, index) => (
              <option key={index} value={col.collectionName}>
                {col.collectionName}
              </option>
            ))}
          </StyledDropDown>

          <button type="submit">speichern</button>
        </StyledForm>
        <StyledTitle>{title}</StyledTitle>
        <StyledP>
          {duration} MIN | {difficulty}
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
        {filterTags
          .filter(({ type }) => type === "diet")
          .map(({ label, type }) => (
            <StyledH2 key={type}>{label}</StyledH2>
          ))}
        <StyledCategoriesDiv>
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
        </StyledCategoriesDiv>
        <StyledHyper>
          <StyledLink onClick={() => setContent("instructions")}>
            Zubereitung
          </StyledLink>
          <StyledLink onClick={() => setContent("notes")}>Notizen</StyledLink>
          <StyledLink onClick={() => setContent("video")}>Video</StyledLink>
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
        {content === "video" && (
          <Link href={youtubeLink}>auf youtube anschauen</Link>
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
  width: calc(100% - (2 * var(--gap-out)));
  justify-content: space-between;
  transition: opacity 0.3s ease-in-out, margin 0.2s ease-out;
  opacity: ${({ $isVisible }) => ($isVisible ? "1" : "0")};
  height: ${({ $isVisible }) => ($isVisible ? "auto" : "0")};
  margin: ${({ $isVisible }) => ($isVisible ? "2.5rem 0 0 0" : "0")};
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
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 10px;
    background-color: var(--color-darkgrey);
    color: var(--color-background);
    cursor: pointer;
  }
  input {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 10px;
    background-color: var(--color-background);
    min-height: 1rem;
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
  gap: 0.5rem;
  flex-wrap: wrap;
  width: calc(100% - (2 * var(--gap-out)));
  margin: 0;
  margin-top: 0.25rem;
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
