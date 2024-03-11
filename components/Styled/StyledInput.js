import styled from "styled-components";

const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: calc(100% - (2 * var(--gap-out)));
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
`;
export default StyledInput;
