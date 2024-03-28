import styled from "styled-components";

import {
  Trash,
  XSmall,
  Plus,
  ArrowLeft,
  ChevronSmall,
  ArrowUP,
  SaveShopping,
  Generate,
} from "@/helpers/svg";

export default function IconButtonLarge({ onClick, style, bottom }) {
  const buttonStyles = {
    arrowLeft: <ArrowLeft width={30} height={30} />,
    chevrondown: <ChevronSmall width={30} height={30} />,
    plus: <Plus width={30} height={30} />,
    x: <XSmall width={30} height={30} />,
    arrowUp: <ArrowUp width={30} height={30} />,
    saveShopping: <SaveShopping width={30} height={30} />,
    generate: <Generate width={30} height={30} />,
    trash: <Trash width={30} height={30} />,
  };
  return (
    <StyledBox $bottom={bottom}>
      <StyledLinkSvg onClick={onClick}>{buttonStyles[style]}</StyledLinkSvg>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  background-color: var(--color-component);
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
`;

const StyledLinkSvg = styled.button`
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
`;
