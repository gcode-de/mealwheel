import styled from "styled-components";

const StyledH2 = styled.h2`
  font-size: large;
  text-align: left;
  width: calc(100% - (2 * var(--gap-out)));
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: space-between;
  a {
    color: var(--color-font);
    cursor: pointer;
  }

`;
export default StyledH2;
