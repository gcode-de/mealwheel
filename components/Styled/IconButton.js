import styled from "styled-components";
import ArrowLeft from "@/public/icons/ArrowSmall.svg";

export default function IconButton({ onClick, style }) {
  const buttonStyles = {
    arrowLeft: <ArrowLeft width={30} height={30} />,
  };
  return (
    <StyledBox>
      <StyledLinkSvg onClick={onClick}>{buttonStyles[style]}</StyledLinkSvg>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  background-color: white;
  position: absolute;
  z-index: 2;
  top: 0.5rem;
  left: 0.5rem;
  width: 40px;
  height: 40px;
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
