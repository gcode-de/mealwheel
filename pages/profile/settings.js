import updateUserinDb from "@/helpers/updateUserInDb";
import { useRouter } from "next/router";

import styled from "styled-components";
import { Spacer, H2, List, P } from "@/components/Styled/Styled";

import IconButton from "@/components/Styled/IconButton";
import SetNumberOfPeople from "@/components/Styled/SetNumberOfPeople";

export default function Settings({ user, mutateUser }) {
  const router = useRouter();
  if (!user) {
    return <p>kein Benutzer gefunden...</p>;
  }

  const { settings } = user;
  const { weekdaysEnabled } = settings;

  if (
    !user.settings.weekdaysEnabled ||
    user.settings.weekdaysEnabled.length === 0
  ) {
    const setWeekdays = {
      0: false,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: false,
    };
    user.settings.weekdaysEnabled = { ...setWeekdays };

    updateUserinDb(user, mutateUser);
  }

  const weekdayLabels = {
    0: "So",
    1: "Mo",
    2: "Di",
    3: "Mi",
    4: "Do",
    5: "Fr",
    6: "Sa",
  };

  async function toggleWeekdays(day) {
    const dayString = String(day);

    if (
      user.settings.weekdaysEnabled &&
      typeof user.settings.weekdaysEnabled === "object"
    ) {
      const isEnabled = user.settings.weekdaysEnabled[dayString];
      user.settings.weekdaysEnabled[dayString] = !isEnabled;
    }

    await updateUserinDb(user, mutateUser);
  }

  async function changeDefaultNumberOfPeople(change) {
    user.settings.defaultNumberOfPeople += change;
    await updateUserinDb(user, mutateUser);
  }

  return (
    <>
      <IconButton
        style="ArrowLeft"
        onClick={() => router.back()}
        left={"var(--gap-out)"}
        top={"var(--gap-out)"}
      />
      <Spacer />
      <H2>Anpassung Menü-Planer</H2>
      <List>
        <P>Tage, für die geplant werden soll:</P>
        <Wrapper>
          {
            // Konvertieren der Objekt-Einträge in ein Array und Sortierung
            Object.entries(weekdaysEnabled)
              // Sortierung, sodass Sonntag (0) am Ende der Liste steht
              .sort(([day1], [day2]) => {
                // Beide Schlüssel in Zahlen umwandeln
                const dayNum1 = parseInt(day1, 10);
                const dayNum2 = parseInt(day2, 10);

                // Sonntag (0) wird als größer behandelt, um ihn ans Ende zu verschieben
                if (dayNum1 === 0) return 1;
                if (dayNum2 === 0) return -1;
                return dayNum1 - dayNum2;
              })
              .map(([day, isEnabled]) => (
                <WeekdayButton
                  key={day}
                  onClick={() => toggleWeekdays(day)}
                  $enabled={isEnabled}
                >
                  {weekdayLabels[day]}
                </WeekdayButton>
              ))
          }
        </Wrapper>
      </List>
      <List>
        <P>Standard-Anzahl Portionen:</P>
        <Wrapper>
          <SetNumberOfPeople
            numberOfPeople={user.settings.defaultNumberOfPeople}
            handleChange={changeDefaultNumberOfPeople}
          />
        </Wrapper>
      </List>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WeekdayButton = styled.button`
  color: var(--color-background);
  background-color: ${(props) =>
    props.$enabled ? "var(--color-darkgrey)" : "var(--color-lightgrey)"};
  text-decoration: ${(props) => (props.$enabled ? "none" : "line-through")};
  border: none;
  height: 2rem;
  width: 2rem;
  border-radius: 8px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
`;
