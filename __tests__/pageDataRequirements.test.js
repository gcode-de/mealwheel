import {
  getPageDataRequirements,
  getRecipeId,
} from "@/helpers/pageDataRequirements";

describe("getPageDataRequirements", () => {
  it("keeps the home page on the lightweight user endpoint", () => {
    expect(getPageDataRequirements("/")).toEqual({
      needsAllUsers: false,
      needsHousehold: false,
      needsRecipes: false,
      allUsersKey: null,
      currentUserKey: "/api/users/user",
    });
  });

  it("only populates user recipes for favorites", () => {
    expect(getPageDataRequirements("/profile/favorites")).toEqual({
      needsAllUsers: false,
      needsHousehold: false,
      needsRecipes: false,
      allUsersKey: null,
      currentUserKey: "/api/users/user?include=recipes",
    });
  });

  it("loads detail-page dependencies without the global recipe list", () => {
    expect(getPageDataRequirements("/recipe/[id]")).toEqual({
      needsAllUsers: true,
      needsHousehold: true,
      needsRecipes: false,
      allUsersKey: "/api/users",
      currentUserKey: "/api/users/user",
    });
  });

  it("requests populated collections only for collection details", () => {
    expect(getPageDataRequirements("/profile/collections/[id]")).toEqual({
      needsAllUsers: true,
      needsHousehold: false,
      needsRecipes: true,
      allUsersKey: "/api/users?include=collections",
      currentUserKey: "/api/users/user?include=recipes",
    });
  });
});

describe("getRecipeId", () => {
  it.each([
    [{ recipe: "recipe-id" }, "recipe-id"],
    [{ recipe: { _id: "populated-id", title: "Soup" } }, "populated-id"],
    [{ recipe: null }, null],
    [undefined, undefined],
  ])("normalizes populated and unpopulated recipe references", (input, id) => {
    expect(getRecipeId(input)).toBe(id);
  });
});
