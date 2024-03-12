import styled from "styled-components";
import Header from "@/components/Styled/Header";

import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Login({ user, error, isLoading }) {
  if (error) {
    <div>
      <Header text={"Login 🥗"} />
      Error...
    </div>;
  }

  if (isLoading) {
    return (
      <>
        <Header text="Login 🥗" />
        <StyledArticle>
          <StyledUl>
            <h2>Lade Login...</h2>
          </StyledUl>
        </StyledArticle>
      </>
    );
  }

  return (
    <>
      <Header text="Login 🥗" />
      <StyledArticle>
        <LoginLink
          // authUrlParams={{
          //   lang: "de-DE",
          // }}
          postLoginRedirectURL="/profile"
        >
          Einloggen
        </LoginLink>

        <RegisterLink
          // authUrlParams={{
          //   lang: "de-DE",
          // }}
          postLoginRedirectURL="/profile"
        >
          Registrieren
        </RegisterLink>
      </StyledArticle>
    </>
  );
}

const StyledArticle = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 3rem;
`;

const StyledUl = styled.ul`
  padding: 10px;
  max-width: 350px;
  margin: 0 auto;
`;
