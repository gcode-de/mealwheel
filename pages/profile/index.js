import IconButton from "@/components/Styled/IconButton";
import StyledList from "@/components/Styled/StyledList";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import Heart from "@/public/icons/heart-svgrepo-com.svg";
import Pot from "@/public/icons/cooking-pot-fill-svgrepo-com.svg";
import StyledP from "@/components/Styled/StyledP";

import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user: kindeUser } = useKindeAuth();

  console.log(kindeUser.id);
  return (
    <>
      <IconButton
        style="Settings"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.push("/profile/settings")}
        fill="var(--color-lightgrey)"
      />
      <WrapperCenter>
        <StyledLogoutLink>Log out</StyledLogoutLink>
        <StyledProfile>
          {kindeUser.picture ? (
            <Image
              src={kindeUser?.picture}
              alt="Profile Picture"
              width={60}
              height={60}
            />
          ) : (
            <h1>🙋‍♀️</h1>
          )}
        </StyledProfile>
      </WrapperCenter>
      <StyledList>
        <p>Hallo, {kindeUser?.given_name || `Mensch`}!</p>
      </StyledList>
      <Wrapper>
        <StyledLink href="/favorites">
          <Heart width={40} height={40} />
          <StyledP>Favoriten</StyledP>
        </StyledLink>
        <StyledLink href="/profile/hasCooked">
          <Pot width={40} height={40} />
          <StyledP>gekocht</StyledP>
        </StyledLink>
      </Wrapper>
    </>
  );
}
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const WrapperCenter = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  bottom: -30px;
`;
const StyledProfile = styled.div`
  background-color: white;
  width: 120px;
  height: 120px;
  border-radius: 100%;
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-font);
  display: flex;
  flex-direction: column;
  align-items: center;
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  justify-content: center;
  cursor: pointer;
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-medium);
  background-color: var(--color-component);
  height: 6rem;
  width: 6rem;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;

const StyledLogoutLink = styled(LogoutLink)`
  text-decoration: none;
  color: var(--color-font);
  display: inline-block;
  position: fixed;
  top: var(--gap-out);
  right: var(--gap-out);
  fill: var(--color-lightgrey);
  color: var(--color-lightgrey);
  cursor: pointer;
  &:hover {
    fill: var(--color-highlight);
    color: var(--color-highlight);
  }
`;
