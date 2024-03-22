import React from "react";
import styled from "styled-components";

export default function ToggleCheckbox({ name, label, defaultChecked }) {
  return (
    <StyledCheckboxContainer>
      <label htmlFor="toggle">
        {label}
        <StyledHiddenCheckbox
          type="checkbox"
          id="toggle"
          name={name}
          defaultChecked={defaultChecked}
        />
        <StyledSliderCheckbox htmlFor="toggle" />
      </label>
    </StyledCheckboxContainer>
  );
}

const StyledCheckboxContainer = styled.div`
  label {
    color: var(--color-text);
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }
`;

const StyledHiddenCheckbox = styled.input`
  display: none;
`;
const StyledSliderCheckbox = styled.span`
  position: relative;
  margin-left: 1rem;
  margin-top: 0rem;
  height: 2rem;
  width: 3.5rem;
  background-color: var(--color-background);
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: inset 0 0 5px rgba(77, 74, 74, 0.1);

  &:before {
    content: "";
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    background-color: var(--color-component);
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;
  }

  input:checked + & {
    background-color: var(--color-darkgrey);
  }

  input:checked + &:before {
    transform: translateX(1.5rem);
  }
`;
