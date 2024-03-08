import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";

import assignRecipeToCalendarDay from "@/helpers/assignRecipeToDay";

import IconButton from "@/components/Styled/IconButton";
import StyledArticle from "@/components/Styled/StyledArticle";
import StyledList from "@/components/Styled/StyledList";
import StyledH2 from "@/components/Styled/StyledH2";
import StyledP from "@/components/Styled/StyledP";
import StyledListItem from "@/components/Styled/StyledListItem";

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
  const router = useRouter();
  const { id } = router.query;
  const servings = Number(router.query.servings) || 1;

  const {
    data: recipe,
    isLoading: dataIsLoading,
    error: dataError,
  } = useSWR(id ? `/api/recipes/${id}` : null);

  const [selectedDate, setSelectedDate] = useState("");
  const [calendarFormIsVisible, setCalendarFormIsVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await assignRecipeToCalendarDay(id, selectedDate, user, mutateUser);

    const localDate = new Date(selectedDate).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setCalendarFormIsVisible(false);
    window.alert(`Das Rezept wurde für ${localDate} eingeplant.`);
  };

  if (error || dataError) {
    return <h1>Fehler...</h1>;
  }

  if (isLoading || dataIsLoading || !recipe) {
    return <h1>Rezept wird geladen...</h1>;
  }

  const {
    _id,
    title,
    instructions,
    imageLink,
    tags,
    youtubeLink,
    ingredients,
    duration,
    difficulty,
  } = recipe;

  difficulty.toUpperCase();

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
        style={{ position: "relative", width: "400", height: "300px" }}
      >
        <Image
          src={imageLink || "/img/jason-briscoe-7MAjXGUmaPw-unsplash.jpg"}
          alt={`recipe Image ${title}`}
          sizes="500px"
          fill
          style={{
            objectFit: "cover",
          }}
        />
      </ImageContainer>
      <StyledArticle>
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
            setCalendarFormIsVisible((prevState) => !prevState);
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
            toggleIsFavorite(_id);
          }}
        />
        <StyledForm onSubmit={handleSubmit} $isVisible={calendarFormIsVisible}>
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
        <h1>{title}</h1>
        <p>
          {duration} MIN | {difficulty}
        </p>
        <StyledH2>
          Zutaten{" "}
          {servings === 1 ? `(für 1 Person` : `(für ${servings} Personen`})
        </StyledH2>
        <StyledList>
          {ingredients.map((ingredient) => (
            <StyledListItem key={ingredient._id}>
              <StyledP>{ingredient.name}</StyledP>
              <StyledP>
                {ingredient.quantity} {ingredient.unit}
              </StyledP>
            </StyledListItem>
          ))}
        </StyledList>
        <StyledHyper>
          <StyledLink onClick={() => setContent("instructions")}>
            Zubereitung
          </StyledLink>
          <StyledLink onClick={() => setContent("video")}>Video</StyledLink>
        </StyledHyper>
        {content === "instructions" && (
          <StyledIngredients>{instructions}</StyledIngredients>
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
  margin-top: 1rem;
`;

const StyledHyper = styled.div`
  display: flex;
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%;
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

const ImageContainer = styled.div`
  position: "relative";
  width: "400";
  height: "300px";
`;

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  transition: opacity 0.3s ease-in-out, margin 0.2s ease-out;
  opacity: ${({ $isVisible }) => ($isVisible ? "1" : "0")};
  height: ${({ $isVisible }) => ($isVisible ? "auto" : "0")};
  margin: ${({ $isVisible }) => ($isVisible ? "1rem 0 2rem 0" : "0")};
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
  }
`;
