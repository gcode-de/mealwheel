import styled from "styled-components";
import Button from "../Styled/StyledButton";
import StyledH2 from "../Styled/StyledH2";

export default function ModalComponent({
  message,
  btnConfirmMessage,
  btnCloseMessage,
  toggleModal,
  onConfirm,
}) {
  return (
    <>
      <Overlay />
      <Modal>
        <StyledH2>{message}</StyledH2>
        <ButtonContainer>
          <Button onClick={onConfirm}>{btnConfirmMessage}</Button>
          <Button onClick={toggleModal}>{btnCloseMessage}</Button>
        </ButtonContainer>
      </Modal>
    </>
  );
}
const Modal = styled.div`
  position: fixed;
  z-index: 4;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-component);
  padding: var(--gap-between);
  border-radius: var(--border-radius-small);
  margin: auto;
  width: calc(100% - (2 * var(--gap-out)));
`;
const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 3;
  background: rgba(49, 49, 49, 0.5);
  margin: auto;
`;
const ButtonContainer = styled.div`
  display: flex;
  gap: var(--gap-between);
`;
