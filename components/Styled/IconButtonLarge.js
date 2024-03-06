import styled from "styled-components";
import ArrowLeft from "@/public/icons/ArrowSmall.svg";
import ChevronSmall from "@/public/icons/ChevronSmall.svg";
import Plus from "@/public/icons/Plus.svg";
import XSmall from "@/public/icons/XSmall.svg";

export default function IconButtonLarge({ onClick, style }) {
  const buttonStyles = {
    arrowLeft: <ArrowLeft width={30} height={30} />,
    chevrondown: <ChevronSmall width={30} height={30} />,
    plus: <Plus width={30} height={30} />,
    x: <XSmall width={30} height={30} />,
  };
  return (
    <StyledBox>
      <StyledLinkSvg onClick={onClick}>{buttonStyles[style]}</StyledLinkSvg>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  background-color: white;
  position: fixed;
  z-index: 300;
  bottom: 6rem;
  left: 50%;
  transform: translateX(-50%);
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
