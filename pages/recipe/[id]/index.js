import Image from "next/image";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { notifySuccess, notifyError } from "/helpers/toast";
import assignRecipesToCalendarDays from "@/helpers/assignRecipesToCalendarDays";
import updateUserinDb from "@/helpers/updateUserInDb";
import { filterTags } from "@/helpers/filterTags";
import SetNumberOfPeople from "@/components/Cards/SetNumberOfPeople";
import IconButton from "@/components/Button/IconButton";
import { Pen, Book, Calendar } from "@/helpers/svg";
import {
  Article,
  List,
  H2,
  P,
  ListItem,
  UnstyledButton,
} from "@/components/Styled/Styled";
import LoadingComponent from "@/components/Loading";
import Notes from "@/components/Notes";
import MenuContainer from "@/components/MenuContainer";
import ModalComponent from "@/components/Modal";
import AddToCollection from "@/components/Forms/AddToCollection";
import Link from "next/link";
import NewCollection from "../../../components/Forms/NewCollection";

export default function DetailPage({
  user,
  mutateUser,
  userIsHouseholdAdmin,
  allUsers,
  household,
  mutateHousehold,
  error,
  isLoading,
  getRecipeProperty,
  toggleIsFavorite,
  toggleHasCooked,
  mutateRecipes,
}) {
  const [content, setContent] = useState("instructions");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalCalendar, setIsModalCalendar] = useState(false);
  const [isModalCollection, setIsModalCollection] = useState(false);
  const [isNewCollection, setIsNewCollection] = useState(false);

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

  function RenderTextWithBreaks(text) {
    const textParts = text.split("\n").map((part, index) => (
      <StyledInstructionsP key={index}>
        {part}
        <br />
      </StyledInstructionsP>
    ));

    return <div>{textParts}</div>;
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

      await assignRecipesToCalendarDays(assignment, household, mutateHousehold);
      console.log("after assign");
      const localDate = new Date(dbDate).toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      notifySuccess(`Das Rezept wurde für ${localDate} eingeplant.`);
      setIsModalCalendar(false);
    } catch (error) {
      notifyError("Das Rezept konnte nicht eingeplant werden.");
    }
  };

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
  function toggleNewCollection() {
    setIsNewCollection(!isNewCollection);
    setIsModalCollection(!isModalCollection);
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
      <Article>
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
            toggleIsFavorite(_id, mutateUser, mutateRecipe);
          }}
        />
        <IconButton
          onClick={() => setIsMenuVisible(!isMenuVisible)}
          right="var(--gap-out)"
          top="-1.25rem"
          style="Menu"
          rotate={isMenuVisible}
        />
        {isMenuVisible && (
          <MenuContainer
            top="2rem"
            right="var(--gap-out)"
            toggleMenu={() => setIsMenuVisible(false)}
          >
            {userIsHouseholdAdmin && (
              <UnstyledButton onClick={toggleModalCalender}>
                <Calendar width={15} height={15} />
                Rezept im Kalender speichern
              </UnstyledButton>
            )}
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
            <AddToCollection
              isModalCollection={isModalCollection}
              setIsModalCollection={setIsModalCollection}
              user={user}
              id={id}
              mutateUser={mutateUser}
              toggleNewCollection={toggleNewCollection}
            />
          </ModalComponent>
        )}
        {isNewCollection && (
          <ModalComponent toggleModal={toggleNewCollection}>
            <NewCollection
              user={user}
              mutateUser={mutateUser}
              setModal={toggleNewCollection}
            />
          </ModalComponent>
        )}
        <StyledTitle>{title}</StyledTitle>
        <P>
          {duration} MIN | {difficulty}
          {recipe.likes > 0 &&
            ` |  ${recipe.likes} ${
              recipe.likes > 1 ? "Schmeckos" : "Schmecko"
            }`}
        </P>
        <H2>
          Zutaten{" "}
          <SetNumberOfPeople
            numberOfPeople={servings}
            handleChange={handleSetNumberOfPeople}
            $margin="-0.4rem 0 0 0"
          />
        </H2>
        <List>
          {ingredients.map((ingredient) => (
            <ListItem key={ingredient._id}>
              <P>
                {ingredient.quantity * servings} {ingredient.unit}
              </P>
              <P>{ingredient.name}</P>
            </ListItem>
          ))}
        </List>
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
          <StyledIngredients>
            {RenderTextWithBreaks(instructions)}
          </StyledIngredients>
        )}
        {content === "notes" && user && (
          <Notes
            user={user}
            _id={id}
            mutateUser={mutateUser}
            foundInteractions={foundInteractions}
          />
        )}
        <Link href={`/profile/community/${author}`}>
          Erstellt von: {allUsers.find((user) => user._id === author).userName}
        </Link>
      </Article>
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

const RestyledH2 = styled(H2)`
  margin-left: 0;
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

const StyledTitle = styled.h1`
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: calc(100% - (2 * var(--gap-out)));
  text-align: center;
`;

const StyledInstructionsP = styled.p`
  margin: 0 0 var(--gap-between) 0;
`;
