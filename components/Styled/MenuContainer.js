import styled from "styled-components";
const MenuContainer = styled.div`
  position: absolute;
  top: var(--gap-between);
  right: calc(3 * var(--gap-between) + 20px);
  z-index: 2;
  background-color: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: var(--gap-between);
  display: flex;
  flex-direction: column;
  gap: var(--gap-between);
`;
export default MenuContainer;
