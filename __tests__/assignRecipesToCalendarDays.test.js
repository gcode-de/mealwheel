import assignRecipesToCalendarDays from "@/helpers/assignRecipesToCalendarDays";
import updateHouseholdInDb from "@/helpers/updateHouseholdInDb";

jest.mock("@/helpers/updateHouseholdInDb", () => jest.fn());

describe("assignRecipesToCalendarDays", () => {
  beforeEach(() => {
    updateHouseholdInDb.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("updates an existing calendar day and preserves unrelated fields", async () => {
    const household = {
      settings: { defaultNumberOfPeople: 4 },
      calendar: [
        {
          date: "2026-08-27T00:00:00.000Z",
          recipe: "old-recipe",
          numberOfPeople: 2,
          notes: "keep me",
        },
      ],
    };

    await assignRecipesToCalendarDays(
      [
        {
          date: "2026-08-27T00:00:00.000Z",
          recipe: "new-recipe",
          servings: 6,
        },
      ],
      household,
      "mutate-household"
    );

    expect(household.calendar).toEqual([
      {
        date: "2026-08-27T00:00:00.000Z",
        recipe: "new-recipe",
        numberOfPeople: 6,
        notes: "keep me",
      },
    ]);
    expect(updateHouseholdInDb).toHaveBeenCalledWith(
      household,
      "mutate-household"
    );
  });

  it("creates missing calendar days with the household default servings", async () => {
    const household = {
      settings: { defaultNumberOfPeople: 3 },
    };

    await assignRecipesToCalendarDays(
      [
        {
          date: "2026-08-28T00:00:00.000Z",
          recipe: "recipe-id",
        },
      ],
      household,
      jest.fn()
    );

    expect(household.calendar).toEqual([
      {
        date: "2026-08-28T00:00:00.000Z",
        recipe: "recipe-id",
        numberOfPeople: 3,
        isDisabled: false,
      },
    ]);
    expect(updateHouseholdInDb).toHaveBeenCalledTimes(1);
  });

  it("keeps existing servings and marks an intentionally empty new day", async () => {
    const household = {
      settings: { defaultNumberOfPeople: 5 },
      calendar: [
        {
          date: "2026-08-29T00:00:00.000Z",
          recipe: "old-recipe",
          numberOfPeople: 2,
        },
      ],
    };

    await assignRecipesToCalendarDays(
      [
        {
          date: "2026-08-29T00:00:00.000Z",
          recipe: "new-recipe",
        },
        {
          date: "2026-08-30T00:00:00.000Z",
          recipe: null,
        },
      ],
      household,
      jest.fn()
    );

    expect(household.calendar).toEqual([
      {
        date: "2026-08-29T00:00:00.000Z",
        recipe: "new-recipe",
        numberOfPeople: 2,
      },
      {
        date: "2026-08-30T00:00:00.000Z",
        recipe: null,
        numberOfPeople: 5,
        isDisabled: null,
      },
    ]);
  });
});
