import styled from "styled-components";

import { Plate } from "@/helpers/svg";

export default function SetNumberOfPeople({
  numberOfPeople,
  handleChange,
  $margin,
}) {
  return (
    <NumberOfPeopleContainer $margin={$margin}>
      <button
        onClick={(event) => {
          event.preventDefault();
          handleChange(-1);
        }}
      >
        -
      </button>
      <span>{numberOfPeople}</span>
      <button
        onClick={(event) => {
          event.preventDefault();
          handleChange(+1);
        }}
      >
        +
      </button>
      <Plate width="1.2em" height="1.2em" />
    </NumberOfPeopleContainer>
  );
}

const NumberOfPeopleContainer = styled.div`
  display: flex;
  gap: 10px;
  width: min-content;
  justify-content: start;
  align-items: center;
  margin: ${(props) => props.$margin};
  font-size: 1.25rem;
  z-index: 2;
  color: var(--color-highlight);
  background-color: var(--color-background);
  padding: 2px 12px;
  border-radius: 10px;
  button {
    border: none;
    background: none;
    font-weight: 900;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
  }
`;
