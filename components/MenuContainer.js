import styled from "styled-components";

export default function MenuContainer({
  top,
  right,
  left,
  children,
  toggleMenu,
}) {
  return (
    <>
      <Container $top={top} $right={right} $left={left}>
        {children}
      </Container>
      <Overlay onClick={toggleMenu} />
    </>
  );
}

const Container = styled.div`
  position: absolute;
  top: ${(props) => props.$top};
  right: ${(props) => props.$right};
  left: ${(props) => props.$left};
  z-index: 5;
  background-color: var(--color-component);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: var(--gap-between);
  display: flex;
  flex-direction: column;
  gap: var(--gap-between);
`;
const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 4;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
`;
