export default async function updateLikes(recipeId, likeChange) {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likeChange }),
    });

    if (!response.ok) {
      throw new Error("Something went wrong with updating likes.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
