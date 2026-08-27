import styled from "styled-components";

const AddButton = styled.button`
  min-width: 44px;
  border: none;
  background-color: ${(props) => props.$color};
  border-radius: var(--border-radius-small);
  min-height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default AddButton;
