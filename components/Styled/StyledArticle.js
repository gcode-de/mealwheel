import styled from "styled-components";

const StyledArticle = styled.article`
  background-color: var(--color-component);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 40px 40px 0 0;
  position: relative;
  top: -40px;
  margin-bottom: -40px;
  z-index: 3;
  padding-bottom: 1rem;
`;

export default StyledArticle;
