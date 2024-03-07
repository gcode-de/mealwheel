import styled from "styled-components";
import IconButton from "./IconButton";

export default function CardSkeleton({
  amount = 1,
  $isLoading,
  text,
  $height,
  numberOfPeople,
  changeNumberOfPeople,
  reassignRecipe,
  day,
}) {
  console.log($height);
  return (
    <>
      {Array.from({ length: amount }, (_, index) => (
        <StyledCardSkeleton key={index} $isLoading={$isLoading}>
          {reassignRecipe !== undefined && (
            <IconButton
              style="Reload"
              right="-1rem"
              top="1rem"
              onClick={() => {
                reassignRecipe(day);
              }}
            />
          )}

          {text}
        </StyledCardSkeleton>
      ))}
    </>
  );
}

const StyledCardSkeleton = styled.li`
  position: relative;
  background-color: var(--color-lightgrey);
  list-style-type: none;
  height: ${({ $height }) => ($height === "small" ? "50px" : "123px")};
  margin: 1.25rem 0 0 0;
  padding-top: 40px;
  text-align: center;
  color: black;
  font-size: 1.5rem;
  border-radius: 20px;
  z-index: 2;
  border: 1px solid var(--color-lightgrey);
  opacity: 0.3;
  box-shadow: 0 0 8px rgb(0 0 0 / 50%);
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
