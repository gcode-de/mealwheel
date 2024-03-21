import styled from "styled-components";

export default function SetNumberOfPeople({ numberOfPeople, handleChange }) {
  return (
    <NumberOfPeopleContainer>
      <button
        onClick={(event) => {
          event.preventDefault();
          handleChange(-1);
        }}
      >
        ➖
      </button>
      <span>{numberOfPeople}</span>
      <button
        onClick={(event) => {
          event.preventDefault();
          handleChange(+1);
        }}
      >
        ➕
      </button>
      👥
    </NumberOfPeopleContainer>
  );
}

const NumberOfPeopleContainer = styled.div`
  display: flex;
  gap: 10px;
  width: min-content;
  justify-content: start;
  margin: 0.75rem 0 0 1.5rem;
  font-size: 1.25rem;
  z-index: 3;
  button {
    border: none;
    /* border: 1px solid var(--color-font);
    border-radius: 50%; */
    background: none;
    font-weight: 900;
    font-size: 1.25rem;
    height: 1.5rem;
    width: 1.5rem;
    cursor: pointer;
  }
`;
