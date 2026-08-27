function updateCachedLikes(data, recipeId, likeChange, persistedRecipe) {
  const updateRecipe = (recipe) =>
    String(recipe?._id) === String(recipeId)
      ? persistedRecipe || {
          ...recipe,
          likes: Math.max(0, (recipe.likes || 0) + likeChange),
        }
      : recipe;

  return Array.isArray(data) ? data.map(updateRecipe) : updateRecipe(data);
}

export default async function updateLikes(recipeId, likeChange, mutate) {
  const persistLikes = async (currentRecipes) => {
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

    const result = await response.json();
    return updateCachedLikes(
      currentRecipes,
      recipeId,
      likeChange,
      result.recipe
    );
  };

  if (!mutate) {
    await persistLikes();
    return;
  }

  return mutate(persistLikes, {
    optimisticData: (currentRecipes) =>
      updateCachedLikes(currentRecipes, recipeId, likeChange),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  });
}
