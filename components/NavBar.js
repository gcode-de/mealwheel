import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";
import Pizza from "../public/icons/pizza-svgrepo-com.svg";
import Calendar from "../public/icons/calendar-1-svgrepo-com.svg";
import Heart from "../public/icons/heart-svgrepo-com.svg";
import List from "../public/icons/list-check-svgrepo-com.svg";
import Gear from "../public/icons/settings-svgrepo-com.svg";
import Profile from "../public/icons/user-svgrepo-com.svg";

export default function NavBar() {
  const router = useRouter();
  function isActive(path) {
    return router.pathname === path;
  }
  const menuItems = [
    { href: "/", label: "Entdecken", Icon: Pizza },
    { href: "/plan", label: "Plan", Icon: Calendar },
    { href: "/profile/favorites", label: "Favoriten", Icon: Heart },
    { href: "/profile", label: "Profil", Icon: Profile },
  ];

  return (
    <StyledNav>
      {menuItems.map(({ href, label, Icon }) => (
        <StyledNavElement href={href} key={href} $active={isActive(href)}>
          <StyledIconContainer>
            <Icon width="100%" height="100%" />
          </StyledIconContainer>
          <span>{label}</span>
        </StyledNavElement>
      ))}
    </StyledNav>
  );
}

const StyledNav = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 10px;
  background-color: var(--color-background);
  border-top: 1.5px solid var(--color-darkgrey);
  z-index: 3;
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const StyledNavElement = styled(Link)`
  color: ${({ $active }) =>
    $active ? "var(--color-highlight)" : "var(--color-lightgrey)"};
  fill: ${({ $active }) =>
    $active ? "var(--color-highlight)" : "var(--color-lightgrey)"};
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;

  @media only screen and (min-width: 900px) {
    &:hover {
      color: black;
      fill: black;
      div {
        transform: scale(1.2);
      }
    }
  }

  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  flex: 1;
`;

const StyledIconContainer = styled.div`
  width: 28px;
  height: 28px;
  margin-bottom: 5px;
  transition: transform 0.2s ease;
  cursor: pointer;
`;
