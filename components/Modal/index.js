import styled from "styled-components";
import { Button, H2 } from "@/components/Styled/Styled";

export default function ModalComponent({
  message,
  btnConfirmMessage,
  btnCloseMessage,
  toggleModal,
  onConfirm,
  children,
}) {
  return (
    <>
      <Overlay onClick={toggleModal} />
      <Modal>
        {message && (
          <>
            <H2>{message}</H2>
            <ButtonContainer>
              <Button onClick={onConfirm}>{btnConfirmMessage}</Button>
              <Button onClick={toggleModal}>{btnCloseMessage}</Button>
            </ButtonContainer>
          </>
        )}
        {children}
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
  max-width: 600px;
`;
const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background: rgba(49, 49, 49, 0.5);
  margin: auto;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--gap-between);
`;
