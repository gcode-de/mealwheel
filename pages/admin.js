import StyledH2 from "../components/Styled/StyledH2";
import useSWR from "swr";
import IconButton from "@/components/Styled/IconButton";
import { useRouter } from "next/router";
import { Spacer } from "@/components/Styled/Styled";

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
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item.positiveFeedback}</li>
            ))}
          </ul>
          <StyledH2>negatives Feedback</StyledH2>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item.negativeFeedback}</li>
            ))}
          </ul>
          <StyledH2>feature Wünsche</StyledH2>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item.newFeatures}</li>
            ))}
          </ul>
          <StyledH2>aktuelle Anzahl Rezepte:</StyledH2>
          <p>{recipes.length}</p>
          <StyledH2>aktuelle Anzahl User:</StyledH2>
          <p>{allUsers.length}</p>
        </>
      )}
    </>
  );
}
