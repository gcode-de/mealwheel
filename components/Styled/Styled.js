import styled from "styled-components";

export function Article() {
  return <StyledArticle></StyledArticle>;
}

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
export function Button() {
  return <Button></Button>;
}
const Button = styled.button`
  border: none;
  background-color: var(--color-darkgrey);
  color: var(--color-background);
  font-size: 0%.75rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  width: 9rem;
  height: 3rem;
  margin-top: 1rem;
`;
export function Select() {
  return <StyledDropDown></StyledDropDown>;
}
const StyledDropDown = styled.select`
  background-color: transparent;
  border: 1px solid var(--color-lightgrey);
  border-radius: 10px;
  display: flex;
  height: 30px;
  align-items: center;
`;
export function H2() {
  return <StyledH2></StyledH2>;
}
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
export function Input() {
  return <StyledInput></StyledInput>;
}

const StyledInput = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: calc(100% - (2 * var(--gap-out)));
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
`;
export function List() {
  return <StyledList></StyledList>;
}
const StyledList = styled.ul`
  list-style: none;
  padding-top: var(--gap-between);
  padding-bottom: var(--gap-between);
  padding-right: calc(2 * var(--gap-between));
  padding-left: calc(2 * var(--gap-between));
  width: calc(100% - (2 * var(--gap-out)));
  border: 1px solid var(--color-lightgrey);
  border-radius: var(--border-radius-small);
  background-color: var(--color-component);
  margin-right: var(--gap-out);
  margin-left: var(--gap-out);
  margin-top: var(--gap-between);
  margin-bottom: var(--gap-between);
  position: relative;
`;
export function ListItem() {
  return <StyledListItem></StyledListItem>;
}
const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: var(--gap-between);
  margin-top: var(--gap-between);
`;
export function P() {
  return <StyledP></StyledP>;
}
const StyledP = styled.p`
  margin: 0;
  margin-bottom: var(--gap-between);
`;
