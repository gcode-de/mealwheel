import styled from "styled-components";
import { Button, H2, Input } from "@/components/Styled/Styled";
import IconButton from "../Button/IconButton";

export default function ModalInput({
  message,
  toggleModal,
  children,
  value,
  onChange,
  defaultVaule,
  onSubmit,
  btnConfirmMessage,
}) {
  return (
    <>
      <Overlay onClick={toggleModal} />
      <Modal>
        <>
          <IconButton
            onClick={toggleModal}
            style={"x"}
            right="-0.5rem"
            top="-0.5rem"
          />
          <H2>{message}</H2>
          <Form onSubmit={onSubmit}>
            <Input
              value={value}
              defaultValue={defaultVaule}
              onChange={onChange}
              name="notes"
            />
            <Button $height $top>
              {btnConfirmMessage}
            </Button>
          </Form>
        </>
        {children}
      </Modal>
    </>
  );
}
const Modal = styled.div`
  position: fixed;
  z-index: 10;
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
  z-index: 9;
  background: rgba(49, 49, 49, 0.5);
  margin: auto;
`;
const Form = styled.form`
  display: flex;
  justify-content: center;
  gap: var(--gap-between);
  input {
    margin-top: 0.5rem;
  }
`;
