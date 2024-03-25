import StyledH2 from "../components/Styled/StyledH2";
import IconButton from "@/components/Styled/IconButton";
import Spacer from "@/components/Styled/Spacer";
import Link from "next/link";
import styled from "styled-components";
import { useRouter } from "next/router";

export default function Imprint() {
  const router = useRouter();
  return (
    <>
      <IconButton
        style="ArrowLeft"
        onClick={() => router.back()}
        left={"var(--gap-out)"}
        top={"var(--gap-out)"}
      />
      <Spacer />
      <StyledH2>Impressum</StyledH2>
      <Wrapper>
        <p>Meal Wheel wird betrieben von:</p>
        <ul>
          <li>Anna von Oesen</li>
          <li>Björn Jentschke</li>
          <li>Samuel Gesang</li>
        </ul>
        <p>
          Wir stellen diese App freiwillig und unentgeltlich zur Verfügung und
          übernehmen keinerlei Haftung.
        </p>
        <p>
          Icons:{" "}
          <Link href="https://de.freepik.com/autor/uicons/icons/uicons-rounded-thin_5090#from_element=families">
            UIcons
          </Link>
        </p>
        <p>
          Stock-Foto:{" "}
          <Link href="https://unsplash.com/de/@jsnbrsc">Jason Briscoe</Link>
        </p>
        <p>
          Weitere Informationen:{" "}
          <Link href="https://github.com/gcode-de/mealwheel">github</Link>
        </p>
        <p>
          Kontakt:{" "}
          <Link href="mailto:info@mealwheel.de">info@mealwheel.de</Link>
        </p>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  margin: 0 var(--gap-out);
`;
