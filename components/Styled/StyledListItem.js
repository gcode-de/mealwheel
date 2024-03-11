import styled from "styled-components";

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - (2 * var(--gap-out)));
  gap: 0.5rem;
  margin-bottom: var(--gap-between);
  margin-top: var(--gap-between);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
`;
export default StyledListItem;
