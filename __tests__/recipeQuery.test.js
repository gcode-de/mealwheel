import {
  createEmptyFilters,
  createUrlWithParams,
} from "@/helpers/recipeQuery";

describe("createEmptyFilters", () => {
  it("creates an independent empty array for every filter type", () => {
    const filters = createEmptyFilters();

    expect(filters).toEqual({
      difficulty: [],
      duration: [],
      diet: [],
      mealtype: [],
    });
    expect(new Set(Object.values(filters)).size).toBe(4);
  });
});

describe("createUrlWithParams", () => {
  it("returns the base URL when no filters are active", () => {
    expect(createUrlWithParams("/api/recipes", createEmptyFilters())).toBe(
      "/api/recipes"
    );
  });

  it("combines filters, sorting and search in a stable URL", () => {
    const filters = createEmptyFilters();
    filters.difficulty = ["easy"];
    filters.diet = ["low carb", "vegan"];

    expect(
      createUrlWithParams(
        "/api/recipes",
        filters,
        { type: "title", order: "asc" },
        "Tomate & Käse"
      )
    ).toBe(
      "/api/recipes?difficulty=easy&diet=low%20carb,vegan&sort=title&order=asc&search=Tomate%20%26%20K%C3%A4se"
    );
  });

  it("ignores incomplete sorting options", () => {
    expect(
      createUrlWithParams("/", null, { type: "likes" }, "pizza")
    ).toBe("/?search=pizza");
  });
});
