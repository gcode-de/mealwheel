import styled from "styled-components";
import ArrowLeft from "@/public/icons/ArrowSmall.svg";
import ChevronSmall from "@/public/icons/ChevronSmall.svg";
import Plus from "@/public/icons/svg/plus.svg";
import XSmall from "@/public/icons/XSmall.svg";
import ArrowUp from "@/public/icons/svg/arrow-alt-up_7434980.svg";
import SaveShopping from "@/public/icons/svg/cart-arrow-down_9795299.svg";
import Generate from "@/public/icons/svg/pen-swirl_10741646.svg";
import Trash from "@/public/icons/svg/trash-xmark_10741775.svg";

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
