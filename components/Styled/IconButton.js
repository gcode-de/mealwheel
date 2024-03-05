import styled from "styled-components";
import ArrowLeft from "@/public/icons/ArrowSmall.svg";
import TriangleLeft from "@/public/icons/arrow-left-3-svgrepo-com.svg";
import TriangleRight from "@/public/icons/arrow-right-2-svgrepo-com.svg";
import Heart from "@/public/icons/heart-svgrepo-com.svg";

export default function IconButton({ onClick, style, left, right, top, fill }) {
  const buttonStyles = {
    ArrowLeft: <ArrowLeft width={30} height={30} />,
    TriangleLeft: <TriangleLeft width={30} height={28} />,
    TriangleRight: <TriangleRight width={30} height={30} />,
    Heart: <Heart width={30} height={30} />,
  };
  return (
    <StyledBox $left={left} $right={right} $top={top}>
      <StyledLinkSvg onClick={onClick} $fill={fill}>
        {buttonStyles[style]}
      </StyledLinkSvg>
    </StyledBox>
  );
}

const StyledBox = styled.div`
  background-color: white;
  position: absolute;
  z-index: 2;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
  right: ${(props) => props.$right};
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  box-shadow: 4px 8px 16px 0 rgb(0 0 0 / 8%);
  cursor: pointer;
`;

const StyledLinkSvg = styled.button`
  fill: ${(props) => props.$fill};
  height: 30px;
  border: none;
  background: none;
`;
