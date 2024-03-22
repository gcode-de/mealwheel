import styled from "styled-components";

export default function MenuContainer({ top, right, children }) {
  return (
    <Container $top={top} $right={right}>
      {children}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: ${(props) => props.$top};
  right: ${(props) => props.$right};
  z-index: 5;
  background-color: var(--color-component);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: var(--gap-between);
  display: flex;
  flex-direction: column;
  gap: var(--gap-between);
`;
