import styled from "styled-components";
import { PlateWheel } from "@/helpers/svg";
import StyledUl from "./Styled/StyledUl";
import CardSkeleton from "@/components/Cards/CardSkeleton";

export default function LoadingComponent({ amount, label = "Inhalte werden geladen" }) {
  return (
    <LoadingRegion role="status" aria-live="polite" aria-label={label}>
      <StyledUl aria-hidden="true">
        <RotatingSVG />
        {amount && <CardSkeleton amount={3} $isLoading />}
      </StyledUl>
    </LoadingRegion>
  );
}

const LoadingRegion = styled.div`
  min-height: 8rem;
`;
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
