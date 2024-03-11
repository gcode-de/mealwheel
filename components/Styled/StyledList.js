import styled from "styled-components";

const StyledList = styled.ul`
  list-style: none;
  padding-top: var(--gap-between);
  padding-bottom: var(--gap-between);
  padding-right: calc(2 * var(--gap-between));
  padding-left: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-medium);
  background-color: var(--color-component);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
`;
export default StyledList;
