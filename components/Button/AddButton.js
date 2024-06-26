import styled from "styled-components";

const AddButton = styled.button`
  width: 30px;
  border: none;
  background-color: ${(props) => props.$color};
  border-radius: var(--border-radius-small);
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default AddButton;
