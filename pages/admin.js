import useSWR from "swr";
import IconButton from "@/components/Button/IconButton";
import { useRouter } from "next/router";
import { Spacer, H2 } from "@/components/Styled/Styled";

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
          <H2>Feedback</H2>
          <H2>positives Feedback</H2>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item.positiveFeedback}</li>
            ))}
          </ul>
          <H2>negatives Feedback</H2>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item.negativeFeedback}</li>
            ))}
          </ul>
          <H2>feature Wünsche</H2>
          <ul>
            {feedback.map((item, index) => (
              <li key={index}>{item.newFeatures}</li>
            ))}
          </ul>
          <H2>aktuelle Anzahl Rezepte:</H2>
          <p>{recipes.length}</p>
          <H2>aktuelle Anzahl User:</H2>
          <p>{allUsers.length}</p>
        </>
      )}
    </>
  );
}
