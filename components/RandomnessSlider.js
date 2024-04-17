import styled from "styled-components";
import { Heart, Pot } from "@/helpers/svg";

export default function RandomnessSlider({
  type,
  min,
  max,
  value,
  onChange,
  $isActive,
}) {
  return (
    <SliderContainer $isActive={$isActive}>
      <StyledSlider
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        $isActive={$isActive}
      />
      <MarksContainer>
        {Array.from({ length: max + 1 }).map((_, index) => (
          <SliderMark key={index} style={{ left: `${(index / max) * 100}%` }} />
        ))}
      </MarksContainer>
      <LabelContainer>
        <div>
          {max - value == 1 ? (
            <>
              1 Rezept mit <br />
              <Heart
                height="1rem"
                width="1rem"
                fill="var(--color-highlight)"
              />{" "}
              und{" "}
              <Pot height="1rem" width="1rem" fill="var(--color-highlight)" />
            </>
          ) : (
            <>
              {max - value} Rezepte mit
              <br />
              <Heart
                height="1rem"
                width="1rem"
                fill="var(--color-highlight)"
              />{" "}
              und{" "}
              <Pot height="1rem" width="1rem" fill="var(--color-highlight)" />
            </>
          )}
        </div>
        <div>
          {value == 1 ? `1 zufälliges Rezept` : `${value} zufällige Rezepte`}
        </div>
      </LabelContainer>
    </SliderContainer>
  );
}

const SliderContainer = styled.div`
  position: relative;
  width: 80%;
  margin: 0 auto;
  opacity: ${(props) => !props.$isActive && "0.2"};
  select {
    position: absolute;
    right: 0;
  }
`;

const MarksContainer = styled.div`
  position: absolute;
  top: 26px;
  left: 14px;
  right: 14px;
  height: 4px;
  display: flex;
  align-items: center;
  z-index: -1;
`;

const SliderMark = styled.span`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: black;
  transform: translateX(-50%);
`;

const StyledSlider = styled.input`
  height: 36px;
  background: none;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: ${(props) => (props.$isActive ? "pointer" : "")};
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: var(--color-font);
    border-radius: 5px;
    border: 1px solid var(--color-font);
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 4px solid var(--color-font);
    height: 25px;
    width: 25px;
    border-radius: 25px;
    background: var(--color-component);
    cursor: ${(props) => (props.$isActive ? "pointer" : "")};
    -webkit-appearance: none;
    margin-top: -13px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: var(--color-font);
  }
  &::-moz-range-track {
    width: 100%;
    height: 4px;
    cursor: ${(props) => (props.$isActive ? "pointer" : "")};
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #000000;
    border-radius: 5px;
    border: 1px solid var(--color-font);
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 4px solid var(--color-font);
    height: 25px;
    width: 25px;
    border-radius: 25px;
    background: none;
    cursor: ${(props) => (props.$isActive ? "pointer" : "")};
  }
  &::-ms-track {
    width: 100%;
    height: 4px;
    cursor: ${(props) => (props.$isActive ? "pointer" : "")};
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: var(--color-font);
    border: 1px solid var(--color-font);
    border-radius: 10px;
    box-shadow: 0px 0px 0px var(--color-font);
  }
  &::-ms-fill-upper {
    background: var(--color-font);
    border: 1px solid var(--color-font);
    border-radius: 10px;
    box-shadow: 0px 0px 0px var(--color-font);
  }
  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px var(--color-font);
    border: 4px solid var(--color-font);
    height: 25px;
    width: 25px;
    border-radius: 25px;
    background: #ffffff;
    cursor: pointer;
  }
  &:focus::-ms-fill-lower {
    background: var(--color-font);
  }
  &:focus::-ms-fill-upper {
    background: var(--color-font);
  }
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    width: 6.5rem;
  }

  :nth-child(1) {
    text-align: left;
  }
  :nth-child(2) {
    text-align: right;
  }
`;
