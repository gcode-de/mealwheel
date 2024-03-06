import styled from "styled-components";

export default function Header({ text }) {
  return (
    <StyledHeader>
      <StyledH1>{text}</StyledH1>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2.5rem;
  position: relative;
`;

const StyledH1 = styled.h1`
  align-self: left;
  font-size: 40px;
  padding-bottom: 0;
  border-bottom: 1px var(--color-darkgrey) solid;
  color: var(--color-darkgrey);
  min-width: 80%;
  margin: 0;
`;
