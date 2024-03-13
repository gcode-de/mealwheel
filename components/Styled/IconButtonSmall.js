import styled from "styled-components";
import PenCircle from "@/public/icons/svg/pen-circle_10742831.svg";
import XSmall from "@/public/icons/XSmall.svg";

export default function IconButtonSmall({ onClick, style, bottom, right }) {
  const buttonStyles = {
    penCircle: <PenCircle width={"1.2rem"} height={"1.2rem"} />,
    x: <XSmall width={"1.3rem"} height={"1.3rem"} />,
  };
  return (
    <StyledBox $bottom={bottom} $right={right}>
      <StyledLinkSvg onClick={onClick}>{buttonStyles[style]}</StyledLinkSvg>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  background-color: white;
  position: absolute;
  z-index: 3;
  bottom: ${(props) => props.$bottom};
  right: ${(props) => props.$right};
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  box-shadow: 0px 2px 5px rgb(0 0 0 / 12%);
`;

const StyledLinkSvg = styled.button`
  height: 1.25rem;
  border: none;
  background: none;
  cursor: pointer;
  fill: var(--color-lightgrey);
  stroke: var(--color-lightgrey);
`;
