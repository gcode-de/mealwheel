import MealCard from "@/components/Styled/MealCard";
import { useRouter } from "next/router";

export default function DetailCollection({ recipes, user }) {
  console.log(recipes, user);
  if (!user) {
    return;
  }
  const router = useRouter();
  const { id } = router.query;
  //such das passende rezept mir den ids aus user.collection.recipes
  return (
    <>
      <h2>hallo</h2>
      {user.collection.recipes.map((recipe) => (
        <MealCard key={recipe} recipe={recipe} />
      ))}
    </>
  );
}
