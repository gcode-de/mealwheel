import { Spacer, H2, Button } from "@/components/Styled/Styled";
import Header from "@/components/Styled/Header";
import updateLikes from "@/helpers/updateLikes";

import useSWR from "swr";
import { useRouter } from "next/router";
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { notifySuccess, notifyError } from "/helpers/toast";

export default function Admin({
  user,
  fetcher,
  recipes,
  mutateRecipes,
  allUsers,
}) {
  const {
    data: feedback,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/feedback`, fetcher);

  const CountUp = ({ target, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (count < target) {
        const timeout = setTimeout(() => setCount(count + 1), 100);
        return () => clearTimeout(timeout);
      }
    }, [count, target]);

    return (
      <h2>
        {count} {label}
      </h2>
    );
  };

  if (!user || !feedback) {
    return;
  }

  function recalculateLikesInRecipes() {
    let performedChanges = 0;
    recipes.forEach((recipe) => {
      const savedLikes = recipe.likes;
      const individualLikes = allUsers.reduce((acc, user) => {
        const isFavourite = user.recipeInteractions.some(
          (interaction) =>
            interaction.recipe === recipe._id && interaction.isFavorite
        );
        return isFavourite ? acc + 1 : acc;
      }, 0);
      const offset = savedLikes - individualLikes;
      if (offset !== 0) {
        performedChanges++;
        updateLikes(recipe._id, offset * -1, mutateRecipes);
      }
    });
    notifySuccess(`Schemckos neu berechnet, ${performedChanges} Änderungen.`);
  }

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  return (
    <Wrapper>
      {user.admin && (
        <>
          <Header text={"Admin, baby!"} />
          <CountUp target={allUsers?.length} label="Benutzer gesamt" />
          <CountUp
            target={
              allUsers?.filter(
                (user) => new Date(user.lastLogin) > fourteenDaysAgo
              ).length
            }
            label="Benutzer letzte 14 Tage"
          />
          <CountUp target={recipes?.length} label="Rezepte" />
          <br />
          <h2>Feedback</h2>
          <h4>positiv</h4>
          <ul>
            {feedback
              .filter(
                (item) =>
                  item.positiveFeedback && item.positiveFeedback.trim() !== ""
              )
              .map((item, index) => (
                <li key={index}>{item.positiveFeedback}</li>
              ))}
          </ul>
          <h4>negativ</h4>
          <ul>
            {feedback
              .filter(
                (item) =>
                  item.negativeFeedback && item.negativeFeedback.trim() !== ""
              )
              .sort(
                (a, b) =>
                  a.negativeFeedback.startsWith("X") -
                  b.negativeFeedback.startsWith("X")
              )
              .map((item, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: item.negativeFeedback }}
                ></li>
              ))}
          </ul>

          <h4>Feature-Wünsche</h4>
          <ul>
            {feedback
              .filter(
                (item) => item.newFeatures && item.newFeatures.trim() !== ""
              )
              .sort(
                (a, b) =>
                  a.newFeatures.startsWith("X") - b.newFeatures.startsWith("X")
              )
              .map((item, index) => (
                <li key={index}>{item.newFeatures}</li>
              ))}
          </ul>
        </>
      )}
      <Button onClick={recalculateLikesInRecipes}>Update Schmeckos</Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 0.5rem 1rem;
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  position: relative;
  li {
    margin-bottom: 0.5rem;
  }
`;
