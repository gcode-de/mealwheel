import {
  expandDietCategories,
  getFilterLabelByValue,
} from "@/helpers/filterTags";

describe("filter tag helpers", () => {
  it("returns the display label for a stored filter value", () => {
    expect(getFilterLabelByValue("medium")).toBe("Fortgeschritten");
    expect(getFilterLabelByValue("unknown")).toBeUndefined();
  });

  it("expands vegetarian and pescetarian categories without duplicates", async () => {
    await expect(
      expandDietCategories(["pescetarian", "vegetarian"])
    ).resolves.toEqual(
      expect.arrayContaining(["pescetarian", "vegetarian", "vegan"])
    );

    const expanded = await expandDietCategories([
      "pescetarian",
      "vegetarian",
    ]);
    expect(expanded).toHaveLength(3);
  });

  it("keeps diets without implied categories unchanged", async () => {
    await expect(expandDietCategories(["keto", "unknown"])).resolves.toEqual([
      "keto",
      "unknown",
    ]);
  });
});
