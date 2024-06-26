import styled from "styled-components";
import { PlateWheel } from "@/helpers/svg";
import StyledUl from "./Styled/StyledUl";
import CardSkeleton from "@/components/Cards/CardSkeleton";

export default function LoadingComponent({ amount }) {
  return (
    <>
      <StyledUl>
        <RotatingSVG />
        {amount && <CardSkeleton amount={3} $isLoading />}
      </StyledUl>
    </>
  );
}
const RotatingSVG = styled(PlateWheel)`
  margin: 4rem auto;
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
