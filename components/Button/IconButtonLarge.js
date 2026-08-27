import styled from "styled-components";

import {
  Trash,
  XSmall,
  Plus,
  ArrowLeft,
  ArrowUp,
  SaveShopping,
  Generate,
} from "@/helpers/svg";

export default function IconButtonLarge({ onClick, style, bottom, ariaLabel }) {
  const labels = {
    arrowLeft: "Zurück",
    plus: "Hinzufügen",
    x: "Schließen",
    arrowUp: "Nach oben scrollen",
    saveShopping: "Zutaten zur Einkaufsliste hinzufügen",
    generate: "Wochenplan automatisch erstellen",
    trash: "Löschen",
  };
  const buttonStyles = {
    arrowLeft: <ArrowLeft width={30} height={30} />,
    plus: <Plus width={30} height={30} />,
    x: <XSmall width={30} height={30} />,
    arrowUp: <ArrowUp width={30} height={30} />,
    saveShopping: <SaveShopping width={30} height={30} />,
    generate: <Generate width={30} height={30} />,
    trash: <Trash width={30} height={30} />,
  };
  return (
    <StyledButton
      type="button"
      $bottom={bottom}
      onClick={onClick}
      aria-label={ariaLabel || labels[style] || "Aktion ausführen"}
    >
      {buttonStyles[style] || <span>Icon nicht gefunden</span>}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  background-color: var(--color-component);
  border: none;
  position: fixed;
  z-index: 300;
  bottom: ${(props) => props.$bottom};
  left: var(--gap-out);
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  cursor: pointer;

  svg {
    display: block;
    margin: auto;
  }
`;
