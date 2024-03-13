import styled from "styled-components";
import PlateWheel from "/public/icons/svg/plate-wheel.svg";

export default function LoadingComponent() {
  return <RotatingSVG />;
}
const RotatingSVG = styled(PlateWheel)`
  margin: 4rem auto;
  /* margin-top: 2rem;
  margin-bottom: 2rem; */
  width: 50px;
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
