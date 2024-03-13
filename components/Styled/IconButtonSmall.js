import styled from "styled-components";
import PenCircle from "@/public/icons/svg/pen-circle_10742831.svg";

export default function IconButtonSmall({ onClick, style, bottom, right }) {
  const buttonStyles = {
    penCircle: <PenCircle width={"1rem"} height={"1rem"} />,
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
  width: 1.5rem;
  height: 1.5rem;
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
`;
