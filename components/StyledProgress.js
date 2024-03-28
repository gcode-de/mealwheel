import styled from "styled-components";

export default function StyledProgress() {
  return <StyledProgressIndicator />;
}

const StyledProgressIndicator = styled.div`
  position: absolute;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-highlight);
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
