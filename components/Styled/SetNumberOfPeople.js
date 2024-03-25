import styled from "styled-components";
import Plate from "@/public/icons/svg/plate-and-utensils-top-view-svgrepo-com.svg";
import IconButton from "./IconButton";
import Reload from "@/public/icons/svg/arrows-retweet_9253335.svg";

export default function SetNumberOfPeople({
  numberOfPeople,
  handleChange,
  $margin,
  reassignRecipe,
  day,
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
      {/* <StyledReloadButton> */}
      {reassignRecipe !== undefined && (
        <Reload
          width="1.2em"
          height="1.2em"
          onClick={() => {
            reassignRecipe(day);
          }}
        />
      )}
      {/* </StyledReloadButton> */}
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
  z-index: 3;
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

// const StyledReloadButton = styled.button`
//   cursor: pointer;
// `;
