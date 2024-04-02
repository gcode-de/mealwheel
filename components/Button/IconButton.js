import styled from "styled-components";

import {
  XSmall,
  Plus,
  ArrowLeft,
  Book,
  Reload,
  TriangleLeft,
  TriangleRight,
  Heart,
  Pot,
  Calendar,
  Edit,
  Settings,
  Leave,
  Menu,
  Bell,
  ArrowSmallLeft,
  ArrowSmallRight,
  Filter,
} from "@/helpers/svg";

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
    Bell: <Bell width={30} height={30} />,
    ArrowSmallLeft: <ArrowSmallLeft width={30} height={30} />,
    ArrowSmallRight: <ArrowSmallRight width={30} height={30} />,
    Filter: <Filter width={20} height={20} />,
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
