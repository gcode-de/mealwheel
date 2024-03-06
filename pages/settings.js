import { useRouter } from "next/router";
import useSWR from "swr";

import StyledH2 from "@/components/Styled/StyledH2";
import StyledList from "@/components/Styled/StyledList";
import StyledP from "@/components/Styled/StyledP";
import styled from "styled-components";

export default function Settings({ user }) {
  const { settings } = user;
  const { weekdaysEnabled } = settings;
  const { mutate } = useSWR("/api/users");

  async function toggleWeekdays(day) {
    const updatedWeekdays = weekdaysEnabled.map((o) =>
      o.day === day ? { ...weekdaysEnabled, enabled: !o.enabled } : day
    );
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weekdaysEnabled: updatedWeekdays }),
    });
    if (!response.ok) {
      console.error(response.status);
      return;
    }
    mutate();
  }
  return (
    <>
      <p>Settings</p>
      <StyledH2>Anpassung Menü-Planer</StyledH2>
      <StyledList>
        <StyledP>Tage, für geplant werden soll:</StyledP>
        <Wrapper>
          {weekdaysEnabled.map((object, index) => (
            <button
              key={index}
              onClick={() => toggleWeekdays(object.day)}
              disabled={object.enabled}
            >
              {object.day}
            </button>
          ))}
        </Wrapper>
        <Wrapper>
          <StyledP>Gerichte pro Tag:</StyledP>
          <Wrapper>
            <button>-</button>
            <StyledP>2</StyledP>
            <button>+</button>
          </Wrapper>
        </Wrapper>
      </StyledList>
    </>
  );
}
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
