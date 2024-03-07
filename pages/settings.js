import useSWR from "swr";

import StyledH2 from "@/components/Styled/StyledH2";
import StyledList from "@/components/Styled/StyledList";
import StyledP from "@/components/Styled/StyledP";
import styled from "styled-components";
import Header from "@/components/Styled/Header";

export default function Settings({ user }) {
  if (!user) {
    return <p>kein Benutzer gefunden..</p>;
  }
  const { mutate } = useSWR(`/api/users/${user._id}`);

  const { settings } = user;
  const { weekdaysEnabled } = settings;

  if (!weekdaysEnabled || weekdaysEnabled.length === 0) {
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
        method: "PUT",
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
      <Header text="Einstellungen 🥗" />
      <StyledArticle>
        <StyledH2>Anpassung Menü-Planer</StyledH2>
        <StyledList>
          <StyledP>Tage, für geplant werden soll:</StyledP>
          <Wrapper>
            {weekdaysEnabled.slice(1).map((object, index) => (
              <WeekdayButton
                key={index}
                onClick={() => toggleWeekdays(object.day)}
                $enabled={object.enabled}
              >
                {object.day.slice(0, 2)}
              </WeekdayButton>
            ))}
            {weekdaysEnabled.slice(0, 1).map((object, index) => (
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
      </StyledArticle>
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
  height: 2rem;
  width: 2rem;
  border-radius: 8px;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;
const StyledArticle = styled.article`
  margin-right: 2.5rem;
  margin-left: 2.5rem;
`;
