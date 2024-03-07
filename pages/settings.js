import useSWR from "swr";

import StyledH2 from "@/components/Styled/StyledH2";
import StyledList from "@/components/Styled/StyledList";
import StyledP from "@/components/Styled/StyledP";
import styled from "styled-components";

export default function Settings({ user }) {
  const { mutate } = useSWR(`/api/users/${user._id}`);

  const { settings } = user;
  const { weekdaysEnabled } = settings;

  if (!weekdaysEnabled) {
    const setWeekdays = [
      { day: "Sonntag", enabled: false },
      { day: "Montag", enabled: true },
      { day: "Dienstag", enabled: true },
      { day: "Mittwoch", enabled: true },
      { day: "Donnerstag", enabled: true },
      { day: "Freitag", enabled: true },
      { day: "Samstag", enabled: false },
    ];
    async function addWeekdays() {
      const response = await fetch(`/api/users/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekdaysEnabled: setWeekdays }),
      });
      if (!response.ok) {
        console.error(response.status);
        return;
      }
    }
    addWeekdays();
  }

  async function toggleWeekdays(day) {
    const updatedWeekdays = weekdaysEnabled?.map((o) =>
      o.day === day ? { ...o, enabled: !o.enabled } : o
    );

    const response = await fetch(`/api/users/${user._id}`, {
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
            <WeekdayButton
              key={index}
              onClick={() => toggleWeekdays(object.day)}
              $enabled={object.enabled}
            >
              {object.day.slice(0, 2)}
            </WeekdayButton>
          ))}
        </Wrapper>
      </StyledList>
    </>
  );
}
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WeekdayButton = styled.button`
  background-color: ${(props) =>
    props.$enabled ? "var(--color-highlight)" : "var(--color-lightgrey)"};
  text-decoration: ${(props) => (props.$enabled ? "none" : "line-through")};
  border: none;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
