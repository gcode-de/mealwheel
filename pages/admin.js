import StyledH2 from "../components/Styled/StyledH2";
import useSWR from "swr";
import StyledList from "../components/Styled/StyledList";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import Spacer from "@/components/Styled/Spacer";

export default function Admin({ user, fetcher, recipes, allUsers }) {
  const {
    data: feedback,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/feedback`, fetcher);
  const router = useRouter();

  if (!user || !feedback) {
    return;
  }

  return (
    <>
      <IconButton
        style="ArrowLeft"
        top="var(--gap-out)"
        left="var(--gap-out)"
        onClick={() => router.back()}
      />
      {user.admin && (
        <>
          <Spacer />
          <StyledH2>Feedback</StyledH2>
          <StyledH2>positives Feedback</StyledH2>
          <StyledList>
            {feedback.map((item, index) => (
              <div key={index}>
                item.positiveFeedback === &quot; &quot; ? ( "kein positives
                feedback" ) : (
                <>
                  <li>{item.positiveFeedback}</li>
                  <button>zu TODO hinzufügen</button>
                  <button>löschen</button>
                </>
                )
              </div>
            ))}
          </StyledList>
          <StyledH2>negatives Feedback</StyledH2>
          <StyledList>
            {feedback.map((item, index) => (
              <div key={index}>
                <li>{item.negativeFeedback}</li>
                <button>zu TODO hinzufügen</button>
                <button>löschen</button>
              </div>
            ))}
          </StyledList>
          <StyledH2>feature Wünsche</StyledH2>
          <StyledList>
            {feedback.map((item, index) => (
              <li key={index}>{item.newFeatures}</li>
            ))}
          </StyledList>
          <StyledH2>aktuelle Anzahl Rezepte:</StyledH2>
          <p>{recipes.length}</p>
          <StyledH2>aktuelle Anzahl User:</StyledH2>
          <p>{allUsers.length}</p>
        </>
      )}
    </>
  );
}
