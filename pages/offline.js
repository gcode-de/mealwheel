import Head from "next/head";
import Link from "next/link";
import styled from "styled-components";

import Header from "@/components/Styled/Header";
import { H2, P } from "@/components/Styled/Styled";

export default function OfflinePage() {
  return (
    <>
      <Head>
        <title>Offline | MealWheel</title>
      </Head>
      <Header text="MealWheel" />
      <OfflineMessage>
        <H2>Du bist gerade offline</H2>
        <P>
          Sobald deine Verbindung wieder da ist, kannst du Rezepte und Pläne
          erneut laden.
        </P>
        <StyledLink href="/">Erneut versuchen</StyledLink>
      </OfflineMessage>
    </>
  );
}

const OfflineMessage = styled.main`
  margin: 4rem var(--gap-out);
  padding: 1.5rem;
  text-align: center;
  background: var(--color-component);
  border-radius: var(--border-radius-medium);
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  color: var(--color-component);
  background: var(--color-darkgrey);
  border-radius: var(--border-radius-small);
  text-decoration: none;
`;
