import styled from "styled-components";
import PlateWheel from "/public/icons/svg/plate-wheel.svg";

export default function LoadingComponent() {
  return <RotatingSVG />;
}
const RotatingSVG = styled(PlateWheel)`
  margin: 50% auto;
  width: 80px;
  display: flex;
  justify-content: center;
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
