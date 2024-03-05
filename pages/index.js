import styled from "styled-components";
import useSWR from "swr";
import Header from "@/components/Styled/Header";
import CardSkeleton from "@/components/Styled/CardSkeleton";
import MealCard from "@/components/Styled/MealCard";
import IconButtonLarge from "@/components/Styled/IconButtonLarge";
import { useRouter } from "next/router";

export default function HomePage() {
  const { data, error, isLoading } = useSWR(`/api/recipes`);
  const router = useRouter();

  if (error) {
    return (
      <div>
        <Header text={"Meal Wheel 🥗"} />
        error
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header text={"Meal Wheel 🥗"} />
        <article>
          <StyledUl>
            Loading recipes...
            <CardSkeleton amount={5} $isLoading />
          </StyledUl>
        </article>
      </>
    );
  }

  return (
    <>
      <Header text={"Meal Wheel 🥗"} />
      <article>
        <StyledUl>
          {data.map((recipe) => {
            return <MealCard key={recipe._id} recipe={recipe} />;
          })}
        </StyledUl>
      </article>
      <IconButtonLarge
        style={"plus"}
        onClick={() => router.push("/addRecipe")}
      />
    </>
  );
}

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
`;
