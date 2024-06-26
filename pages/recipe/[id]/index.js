import Image from "next/image";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { notifySuccess, notifyError } from "/helpers/toast";
import { getFilterLabelByValue } from "@/helpers/filterTags";
import assignRecipesToCalendarDays from "@/helpers/assignRecipesToCalendarDays";
import updateUserinDb from "@/helpers/updateUserInDb";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";
import { filterTags } from "@/helpers/filterTags";
import SetNumberOfPeople from "@/components/Cards/SetNumberOfPeople";
import IconButton from "@/components/Button/IconButton";
import {
  Pen,
  Book,
  Calendar,
  Copy,
  Exclamation,
  Shopping,
  XSmall,
} from "@/helpers/svg";
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
  mutateAllUsers,
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
  const [isLikedVisible, setIsLikedVisible] = useState(false);
  const [isModalReport, setIsModalReport] = useState(false);

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

  function toggleModalReport() {
    setIsModalReport(!isModalReport);
    setIsMenuVisible(false);
  }

  async function duplicateRecipe() {
    const modifiedRecipeData = {
      ...recipe,
      title: `Kopie von ${recipe.title}`,
      author: user._id,
    };
    delete modifiedRecipeData._id;

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedRecipeData),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Duplizieren des Rezepts");
      }

      const result = await response.json();
      notifySuccess("Rezept wurde dupliziert.");
      setIsMenuVisible(false);
      router.push(`/recipe/${result?.id}`);
    } catch (error) {
      console.error("Fehler beim Duplizieren des Rezepts:", error);
      setIsMenuVisible(false);
      notifyError("Fehler beim Duplizieren des Rezepts");
    }
  }

  async function addIngredientsToShoppinglist() {
    // Berechne die neuen Mengen basierend auf der aktuellen Portionenzahl
    const adjustedIngredients = recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity * servings,
      isChecked: false,
    }));

    const uncategorizedCategory = household.shoppingList.find(
      (category) => category.category === "Unsortiert"
    );

    if (uncategorizedCategory) {
      uncategorizedCategory.items.push(...adjustedIngredients);
    } else {
      household.shoppingList.push({
        category: "Unsortiert",
        items: adjustedIngredients,
      });
    }

    setIsMenuVisible(false);

    await updateHouseholdInDb(household, mutateHousehold)
      .then(() => notifySuccess("Zutaten wurden zur Einkaufsliste hinzugefügt"))
      .catch((error) => {
        console.error("Fehler beim Aktualisieren der Einkaufsliste", error);
        notifyError(
          "Es gab ein Problem beim Hinzufügen der Zutaten zur Einkaufsliste."
        );
      });
  }

  async function reportRecipe(event) {
    event.preventDefault();
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        negativeFeedback: `<a href="/profile/community/${user?._id}">${
          user?.userName
        }</a> hat <a href="/recipe/${recipe._id}">${
          recipe.title
        }</a> zur Überprüfung gemeldet. Begründung: ${event.target[0].value.trim()}.`,
      }),
    });
    setIsMenuVisible(false);
    if (response.ok) {
      setIsModalReport(false);
      notifySuccess("Rezept zur Überprüfung gemeldet.");
    } else {
      notifyError("Melden fehlgeschlagen.");
    }
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
        onError={(event) => {
          event.target.id = "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg";
          event.target.srcset = "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg";
        }}
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
          onClick={async () => {
            if (!user) {
              notifyError("Bitte zuerst einloggen.");
              return;
            }
            await toggleIsFavorite(_id, mutateUser, mutateRecipe);
            await mutateAllUsers();
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
            <UnstyledButton onClick={addIngredientsToShoppinglist}>
              <Shopping width={15} height={15} />
              Zutaten in die Einkaufsliste
            </UnstyledButton>
            <UnstyledButton onClick={duplicateRecipe}>
              <Copy width={15} height={15} />
              Rezept duplizieren
            </UnstyledButton>
            {userIsAuthor && (
              <UnstyledButton onClick={() => router.push(`/recipe/${id}/edit`)}>
                <Pen width={15} height={15} />
                Rezept bearbeiten
              </UnstyledButton>
            )}
            {!userIsAuthor && (
              <UnstyledButton
                onClick={() => {
                  setIsMenuVisible(false);
                  setIsModalReport(true);
                }}
              >
                <Exclamation width={15} height={15} />
                Rezept melden
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
        {isModalReport && (
          <ModalComponent toggleModal={toggleModalReport}>
            <StyledForm onSubmit={reportRecipe}>
              <h3>Dieses Rezept melden:</h3>
              <label htmlFor="date">Begründung:</label>
              <input name="report-text" required />
              <button type="submit">melden</button>
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
          {duration} MIN | {getFilterLabelByValue(difficulty)}
          {recipe.likes > 0 && ` |  `}
          <ClickableLikes
            onClick={() => {
              setIsLikedVisible((prev) => !prev);
            }}
          >
            {recipe.likes > 0 &&
              `${recipe.likes} ${recipe.likes > 1 ? "Schmeckos" : "Schmecko"}`}
          </ClickableLikes>
        </P>
        {isLikedVisible && (
          <UserLikes>
            Schmeckos:
            {allUsers
              .filter((user) =>
                user.recipeInteractions.some(
                  (interaction) =>
                    interaction.recipe === recipe._id &&
                    interaction.isFavorite === true
                )
              )
              .map((likeUser) => (
                <Link
                  key={likeUser._id}
                  href={`/profile/community/${likeUser._id}`}
                >
                  {likeUser.userName}
                </Link>
              ))}
            <StyledXSmall
              onClick={() => {
                setIsLikedVisible(false);
              }}
            />
          </UserLikes>
        )}
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
                {Math.round(ingredient.quantity * servings * 100) / 100}{" "}
                {ingredient.unit}
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
        {allUsers.find((user) => user._id === author) && (
          <Link href={`/profile/community/${author}`}>
            Erstellt von:{" "}
            {allUsers.find((user) => user._id === author)?.userName}
          </Link>
        )}
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
  overflow-wrap: break-word;
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
  height: 1.75rem;
  margin-bottom: 0.5rem;
  margin-right: 0.25rem;
  padding: 0.25rem 0.5rem;
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

const ClickableLikes = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const UserLikes = styled.div`
  border: 1px solid var(--color-lightgrey);
  border-radius: 10px;
  padding: 0.5rem 0.5rem;
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  overflow-wrap: break-word;
  display: flex;
  gap: var(--gap-between);
  position: relative;
  font-size: 0.85rem;
`;

const StyledXSmall = styled(XSmall)`
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  cursor: pointer;
`;
