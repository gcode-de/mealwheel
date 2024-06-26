import styled from "styled-components";
import MenuContainer from "../MenuContainer";
import { Menu, Reload, Pen } from "@/helpers/svg";
import { useState } from "react";

export default function CardSkeleton({
  amount = 1,
  $isLoading,
  text,
  $height,
  reassignRecipe,
  weekdays,
  index,
  isDisabled,
  editNotes,
  notes,
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
          {weekdays && !isDisabled && (
            <StyledMenu
              width={30}
              height={30}
              onClick={() => toggleMenu(index)}
              $rotate={menuVisible[index]}
            />
          )}
          {menuVisible[index] && (
            <MenuContainer
              top="7.25rem"
              right="calc(3 * var(--gap-between) + 20px)"
              toggleMenu={() => toggleMenu(index)}
            >
              <UnstyledButton
                onClick={() => {
                  reassignRecipe(weekdays[index].date);
                }}
              >
                <Reload width={15} height={15} /> Neues Rezept laden
              </UnstyledButton>
              <UnstyledButton onClick={editNotes}>
                <Pen width={15} height={15} />
                {notes ? "Notiz bearbeiten" : "Notiz hinzufügen"}
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
  margin: 1.25rem 0 var(--gap-between) 0;
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
    var(--color-skeleton)`};
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

const StyledMenu = styled(Menu)`
  rotate: 90deg;
  cursor: pointer;
  background-color: var(--color-background);
  border-radius: 100%;
  align-self: end;
  transform: ${(props) => (props.$rotate ? "rotate(90deg)" : "0")};
  padding: 5px;
  margin: 0 2.05rem 0.5rem 0;
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
  cursor: pointer;
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
