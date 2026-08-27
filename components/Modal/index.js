import styled from "styled-components";
import { Button, H2 } from "@/components/Styled/Styled";
import { useEffect, useId, useRef } from "react";

export default function ModalComponent({
  message,
  btnConfirmMessage,
  btnCloseMessage,
  toggleModal,
  onConfirm,
  children,
}) {
  const titleId = useId();
  const modalRef = useRef(null);
  const toggleModalRef = useRef(toggleModal);
  toggleModalRef.current = toggleModal;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const modal = modalRef.current;
    modal?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        toggleModalRef.current();
        return;
      }

      if (event.key !== "Tab" || !modal) return;
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <>
      <Overlay onClick={toggleModal} />
      <Modal
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={message ? titleId : undefined}
        aria-label={message ? undefined : "Dialog"}
        tabIndex={-1}
      >
        {message && (
          <>
            <H2 id={titleId}>{message}</H2>
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
  width: min(calc(100% - (2 * var(--gap-out))), 600px);
  max-width: 600px;
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
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
