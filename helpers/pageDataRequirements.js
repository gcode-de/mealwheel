const routesWithAllUsers = new Set([
  "/admin",
  "/profile",
  "/profile/settings",
  "/profile/collections/[id]",
  "/profile/community",
  "/profile/community/active",
  "/profile/community/[id]",
  "/recipe/[id]",
]);

const routesWithHousehold = new Set([
  "/plan",
  "/shopping",
  "/profile/settings",
  "/recipe/[id]",
]);

const routesWithRecipes = new Set([
  "/admin",
  "/plan",
  "/profile/myRecipes",
  "/profile/collections/[id]",
  "/profile/community/[id]",
]);

const routesWithPopulatedUserRecipes = new Set([
  "/plan",
  "/profile/favorites",
  "/profile/hasCooked",
  "/profile/collections/[id]",
]);

export function getPageDataRequirements(pathname) {
  const needsAllUsers = routesWithAllUsers.has(pathname);
  const needsHousehold = routesWithHousehold.has(pathname);
  const needsRecipes = routesWithRecipes.has(pathname);
  const needsPopulatedUserRecipes =
    routesWithPopulatedUserRecipes.has(pathname);

  return {
    needsAllUsers,
    needsHousehold,
    needsRecipes,
    allUsersKey: needsAllUsers
      ? `/api/users${
          pathname === "/profile/collections/[id]"
            ? "?include=collections"
            : ""
        }`
      : null,
    currentUserKey: `/api/users/user${
      needsPopulatedUserRecipes ? "?include=recipes" : ""
    }`,
  };
}

export function getRecipeId(interaction) {
  return interaction?.recipe?._id || interaction?.recipe;
}
