import IconButton from "@/components/Button/IconButton";
import { Spacer, H2 } from "@/components/Styled/Styled";

import useSWR from "swr";
import { useRouter } from "next/router";
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
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      {user.admin && (
        <>
          <Spacer />
          <CountUp target={allUsers.length} label="Benutzer" />
          <CountUp target={recipes.length} label="Rezepte" />
          <br />
          <h2>Feedback</h2>
          <h4>positiv</h4>
          <ul>
            {feedback.map((item, index) =>
              item.positiveFeedback ? (
                <li key={index}>{item.positiveFeedback}</li>
              ) : null
            )}
          </ul>
          <h4>negativ</h4>
          <ul>
            {feedback.map((item, index) =>
              item.negativeFeedback ? (
                <li key={index}>{item.negativeFeedback}</li>
              ) : null
            )}
          </ul>

          <h4>Feature-Wünsche</h4>
          <ul>
            {feedback.map((item, index) =>
              item.newFeatures ? <li key={index}>{item.newFeatures}</li> : null
            )}
          </ul>
        </>
      )}
    </>
  );
}
