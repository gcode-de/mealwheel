import { Spacer, H2 } from "@/components/Styled/Styled";
import Header from "@/components/Styled/Header";

import useSWR from "swr";
import { useRouter } from "next/router";
import styled from "styled-components";
import React, { useState, useEffect } from "react";

export default function Admin({ user, fetcher, recipes, allUsers }) {
  const {
    data: feedback,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/feedback`, fetcher);

  const router = useRouter();

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
  console.log(feedback);

  return (
    <Wrapper>
      {user.admin && (
        <>
          <Header text={"Admin, baby!"} />
          <CountUp target={allUsers.length} label="Benutzer" />
          <CountUp target={recipes.length} label="Rezepte" />
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
`;
