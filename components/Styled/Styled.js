import styled from "styled-components";

export const Article = styled.article`
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

export const Button = styled.button`
  border: none;
  background-color: var(--color-darkgrey);
  color: var(--color-background);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  width: 9rem;
  height: ${(props) => (props.$height ? "1.5rem" : "3rem")};
  margin-top: ${(props) => (props.$top ? "0.5rem" : "1rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
`;

export const Select = styled.select`
  background-color: transparent;
  border: 1px solid var(--color-lightgrey);
  border-radius: 10px;
  display: flex;
  height: 30px;
  align-items: center;
  padding-left: 0.25rem;
  padding-right: 0.75rem;
`;

export const H2 = styled.h2`
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

export const Input = styled.input`
  background-color: var(--color-background);
  border: none;
  border-radius: 10px;
  height: 30px;
  width: calc(100% - (2 * var(--gap-out)));
  flex-grow: ${(props) => props.$flexGrow};
  padding: 0.7rem;
`;

export const List = styled.ul`
  list-style: none;
  padding-top: var(--gap-between);
  padding-bottom: var(--gap-between);
  padding-right: calc(1 * var(--gap-between));
  padding-left: calc(1 * var(--gap-between));
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

export const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: var(--gap-between);
  margin-top: var(--gap-between);
`;

export const P = styled.p`
  margin: 0;
  margin-bottom: var(--gap-between);
`;

export const Spacer = styled.div`
  height: var(--height-header);
  position: relative;
`;

export const UnstyledButton = styled.button`
  background-color: transparent;
  border: none;
  text-align: start;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  gap: var(--gap-between);
  height: 2rem;
  color: var(--color-font);
  &:hover {
    background-color: var(--color-background);
  }
`;
