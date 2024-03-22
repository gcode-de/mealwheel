import Header from "../../components/Styled/Header";
import GoogleIcon from "/public/icons/svg/google.svg";
import Button from "../../components/Styled/StyledButton";

import styled from "styled-components";
import { getProviders, signIn } from "next-auth/react";

export default function SignIn({ providers }) {
  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <StyledWrapper>
        Melde dich an, um alle Funktionen zu nutzen!
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <StyledButton
              onClick={() => signIn(provider.id, { callbackUrl: "/profile" })}
            >
              {getProviderIcon(provider.name)}
              <div>Anmelden mit {provider.name}</div>
            </StyledButton>
          </div>
        ))}
      </StyledWrapper>
    </>
  );
}

const getProviderIcon = (providerName) => {
  switch (providerName) {
    case "Google":
      return <GoogleIcon className="provider-icon" />;
    default:
      return null;
  }
};

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

const StyledWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
`;

const StyledButton = styled(Button)`
  width: max-content;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .provider-icon {
    width: 1.5em;
    height: 1.5em;
    fill: white;
    margin-right: 0.5rem;
  }
`;
