import styled from "styled-components";

const AddButton = styled.button`
  width: 3rem;
  border: none;
  background-color: ${(props) => props.$color};
  border-radius: 10px;
  height: 30px;
`;
export default AddButton;
