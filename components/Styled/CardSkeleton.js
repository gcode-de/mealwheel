import styled from "styled-components";
import IconButton from "./IconButton";
import MenuContainer from "../MenuContainer";
import { BookUser, Menu, Reload, Trash } from "@/helpers/svg";
import { useState } from "react";

export default function CardSkeleton({
  amount = 1,
  $isLoading,
  text,
  $height,
  numberOfPeople,
  changeNumberOfPeople,
  reassignRecipe,
  day,
  weekdays,
  index,
}) {
  const [menuVisible, setMenuVisible] = useState(
    weekdays ? new Array(weekdays.length).fill(false) : []
  );

  function toggleMenu(index) {
    setMenuVisible((prevMenuVisible) => {
      const updatedMenuVisible = [...prevMenuVisible];
      updatedMenuVisible[index] = !prevMenuVisible[index];
      return updatedMenuVisible;
    });
  }
  return (
    <>
      {Array.from({ length: amount }, (_, ind) => (
        <StyledCardSkeleton key={ind} $isLoading={$isLoading} $height={$height}>
          {weekdays && <StyledDragLine />}
          <MenuButton onClick={() => toggleMenu(index)}>
            <StyledMenu width={30} height={30} />
          </MenuButton>
          {menuVisible[index] && (
            <MenuContainer
              top="6.5rem"
              right="calc(3 * var(--gap-between) + 20px)"
            >
              <UnstyledButton
                onClick={() => {
                  reassignRecipe(weekdays[index].date);
                }}
              >
                {console.log(weekdays[index].date)}
                <Reload width={15} height={15} /> Neues Rezept laden
              </UnstyledButton>
            </MenuContainer>
          )}
          {text}
        </StyledCardSkeleton>
      ))}
    </>
  );
}

const StyledCardSkeleton = styled.li`
  position: relative;
  display: flex;
  justify-content: end;
  background-color: var(--color-skeleton);
  list-style-type: none;
  height: 123px;
  margin: 1.25rem 0 0 0;
  padding-top: 40px;
  text-align: center;
  color: black;
  font-size: 1.5rem;
  border-radius: 20px;
  z-index: 2;
  border: none;
  box-shadow: 0px 4px 8px 0 rgb(0 0 0 / 8%);
  background: ${({ $isLoading }) =>
    $isLoading &&
    `linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    var(--color-lightgrey)`};
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
  @keyframes shine {
    to {
      background-position: 100% 0;
    }
  }
`;

const MenuButton = styled.button`
  background-color: var(--color-background);
  border: none;
  z-index: 3;
  border-radius: 50px;
  align-self: end;
  padding-bottom: 0;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 1rem 0.5rem 0;
`;

const StyledMenu = styled(Menu)`
  rotate: 90deg;
  cursor: pointer;
  border-radius: var(--border-radius-large);
`;

const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  gap: var(--gap-between);
  height: 1rem;
  color: var(--color-font);
  z-index: 3;
  &:hover {
    background-color: var(--color-background);
  }
`;

const StyledDragLine = styled.div`
  position: absolute;
  right: 0.25rem;
  top: 2.25rem;
  z-index: 3;
  width: 3px;
  box-shadow: inset 0 0 5px rgba(77, 74, 74, 0.2);
  height: 3.25rem;
  border-radius: var(--border-radius-medium);
  background-color: var(--color-background);
`;
