import React, { useId } from "react";
import styled from "styled-components";

export default function ToggleCheckbox({
  name,
  label,
  defaultChecked,
  onChange,
  $sliderSize,
  index,
  $marginTop,
  $marginLeft,
  ariaLabel,
}) {
  const generatedId = useId();
  const inputId = `toggle-${index ?? generatedId}`;
  return (
    <StyledCheckboxContainer $marginTop={$marginTop}>
      <label htmlFor={inputId}>
        {label}
        <StyledHiddenCheckbox
          type="checkbox"
          id={inputId}
          name={name}
          defaultChecked={defaultChecked}
          onChange={onChange}
          aria-label={ariaLabel || label || "Option umschalten"}
        />
        <StyledSliderCheckbox
          aria-hidden="true"
          $sliderSize={$sliderSize}
          $marginLeft={$marginLeft}
        />
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
    margin-top: ${(props) => props.$marginTop};
  }
`;

const StyledHiddenCheckbox = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;

  &:focus-visible + span {
    outline: 3px solid var(--color-highlight);
    outline-offset: 3px;
  }
`;
const StyledSliderCheckbox = styled.span`
  position: relative;
  margin-left: ${(props) => props.$marginLeft};
  margin-top: 0rem;
  height: ${(props) =>
    props.$sliderSize}; // Verwende die Prop sliderSize für die Höhe
  width: ${(props) =>
    parseFloat(props.$sliderSize) * 1.75 +
    "rem"}; // Berechne die Breite entsprechend der Höhe
  background-color: var(--color-background);
  border-radius: ${(props) =>
    parseFloat(props.$sliderSize) / 2 +
    "rem"}; // Berechne den Radius entsprechend der Höhe
  cursor: pointer;
  box-shadow: inset 0 0 5px rgba(77, 74, 74, 0.1);

  &:before {
    content: "";
    position: absolute;
    top: calc(
      49.95% - ${(props) => parseFloat(props.$sliderSize) * 0.375 + "rem"}
    ); // Zentriere den Punkt auf der vertikalen Achse
    left: calc(
      30% - ${(props) => parseFloat(props.$sliderSize) * 0.375 + "rem"}
    ); // Zentriere den Punkt auf der horizontalen Achse
    width: calc(
      ${(props) => parseFloat(props.$sliderSize) * 0.75 + "rem"}
    ); // Verwende die Hälfte der Slider-Größe für den Punkt
    height: calc(
      ${(props) => parseFloat(props.$sliderSize) * 0.75 + "rem"}
    ); // Verwende die Hälfte der Slider-Größe für den Punkt
    background-color: var(--color-component);
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;
  }

  input:checked + & {
    background-color: var(--color-highlight);
  }

  input:checked + &:before {
    transform: translateX(
      calc(${(props) => parseFloat(props.$sliderSize) * 0.75 + "rem"})
    ); // Bewege den Punkt auf die rechte Seite, basierend auf der Slider-Größe;
  }
`;
