import styled from "styled-components";

import ArrowLeft from "@/public/icons/svg/chevron-left-svgrepo-com.svg";
import ChevronSmall from "@/public/icons/ChevronSmall.svg";
import Plus from "@/public/icons/svg/plus.svg";
import XSmall from "@/public/icons/XSmall.svg";
import Reload from "@/public/icons/reload-svgrepo-com.svg";
import TriangleLeft from "@/public/icons/arrow-left-3-svgrepo-com.svg";
import TriangleRight from "@/public/icons/arrow-right-2-svgrepo-com.svg";
import Heart from "@/public/icons/heart-svgrepo-com.svg";
import Pot from "@/public/icons/cooking-pot-fill-svgrepo-com.svg";
import Calendar from "@/public/icons/calendar-1-svgrepo-com.svg";
import Edit from "@/public/icons/edit-3-svgrepo-com (2).svg";
import Settings from "@/public/icons/settings-svgrepo-com.svg";
import Book from "@/public/icons/svg/book-user_9856365.svg";
import Leave from "@/public/icons/svg/arrow-left-from-line_9253329.svg";
import Menu from "/public/icons/svg/menu.svg";
import ArrowSmallLeft from "@/public/icons/arrow-small-left_10513360.svg";
import ArrowSmallRight from "@/public/icons/arrow-small-right_10513361.svg";

export default function IconButton({
  onClick,
  style,
  left,
  right,
  top,
  fill,
  rotate,
}) {
  const buttonStyles = {
    chevrondown: <ChevronSmall width={30} height={30} />,
    plus: <Plus width={30} height={30} />,
    x: <XSmall width={30} height={30} />,
    ArrowLeft: <ArrowLeft width={30} height={30} />,
    TriangleLeft: <TriangleLeft width={30} height={28} />,
    TriangleRight: <TriangleRight width={30} height={30} />,
    Heart: <Heart width={30} height={30} />,
    Pot: <Pot width={30} height={30} />,
    Reload: <Reload width={30} height={30} />,
    Calendar: <Calendar width={30} height={30} />,
    Edit: <Edit width={30} height={30} />,
    Settings: <Settings width={30} height={30} />,
    Book: <Book width={25} height={25} />,
    Leave: <Leave width={20} height={20} />,
    Menu: <Menu width={30} height={30} />,
    ArrowSmallLeft: <ArrowSmallLeft width={30} height={30} />,
    ArrowSmallRight: <ArrowSmallRight width={30} height={30} />,
  };
  return (
    <StyledBox $left={left} $right={right} $top={top} $rotate={rotate}>
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
  transform: ${(props) => (props.$rotate ? "rotate(90deg)" : "0")};
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
  fill: ${(props) => props.$fill || "var(--color-font)"};
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
`;
