import styled from "styled-components";
import { Heart } from "@/helpers/svg";

export default function LikesDisplay({
  likes,
  $isFavorite,
  onToggleIsFavorite,
  $margin,
}) {
  return (
    <LikesDisplayContainer $margin={$margin}>
      {likes > 0 && `${likes} ${likes > 1 ? "Schmeckos" : "Schmecko"}`}
      <button
        onClick={(event) => {
          event.preventDefault();
          onToggleIsFavorite();
        }}
      >
        <StyledHeart $isFavorite={$isFavorite} />
      </button>
    </LikesDisplayContainer>
  );
}

const LikesDisplayContainer = styled.div`
  display: flex;
  gap: 10px;
  width: max-content;
  justify-content: start;
  align-items: center;
  margin: ${(props) => props.$margin};
  font-size: 0.8rem;
  font-weight: 300;
  z-index: 2;
  color: var(--color-font);
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

const StyledHeart = styled(Heart)`
  height: 1rem;
  width: 1rem;
  fill: ${({ $isFavorite }) =>
    $isFavorite ? "var(--color-highlight)" : "var(--color-lightgrey)"};
`;
