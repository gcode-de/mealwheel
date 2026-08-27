import styled from "styled-components";

import LoadingComponent from "@/components/Loading";
import Header from "@/components/Styled/Header";
import { H2, P } from "@/components/Styled/Styled";

export function PageLoading({ title, amount = false, label }) {
  return (
    <>
      {title && <Header text={title} />}
      <LoadingComponent amount={amount} label={label} />
    </>
  );
}

export function PageError({
  title,
  message = "Die Daten konnten nicht geladen werden.",
  onRetry,
}) {
  return (
    <>
      {title && <Header text={title} />}
      <StateContainer role="alert">
        <H2>Da ist etwas schiefgelaufen</H2>
        <P>{message}</P>
        {onRetry && (
          <RetryButton type="button" onClick={onRetry}>
            Erneut versuchen
          </RetryButton>
        )}
      </StateContainer>
    </>
  );
}

const StateContainer = styled.main`
  margin: 4rem var(--gap-out);
  padding: 1.5rem;
  text-align: center;
  background: var(--color-component);
  border-radius: var(--border-radius-medium);
`;

const RetryButton = styled.button`
  min-height: 44px;
  margin-top: 1rem;
  padding: 0.65rem 1rem;
  border: 0;
  border-radius: var(--border-radius-small);
  color: var(--color-component);
  background: var(--color-darkgrey);
  cursor: pointer;
`;
