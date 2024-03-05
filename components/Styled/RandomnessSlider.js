import styled from "styled-components";

export default function RandomnessSlider({ type, min, max, value, onChange }) {
  return (
    <SliderContainer>
      <StyledSlider
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
      />
      <MarksContainer>
        {Array.from({ length: max + 1 }).map((_, index) => (
          <SliderMark key={index} style={{ left: `${(index / max) * 100}%` }} />
        ))}
      </MarksContainer>
    </SliderContainer>
  );
}

const SliderContainer = styled.div`
  position: relative;
  width: 80%;
`;

const MarksContainer = styled.div`
  position: absolute;
  top: 26px; // Adjust this value based on your needs
  left: 14px;
  right: 14px;
  height: 4px;
  display: flex;
  align-items: center;
`;

const SliderMark = styled.span`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: black;
  transform: translateX(-50%);
  z-index: -1;
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
    cursor: pointer;
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
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -13px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: var(--color-font);
  }
  &::-moz-range-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
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
    cursor: pointer;
  }
  &::-ms-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
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
