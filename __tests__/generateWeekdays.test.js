import generateWeekdays from "@/helpers/generateWeekdays";

describe("generateWeekdays", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-27T15:30:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("creates a Monday-to-Sunday week at UTC midnight", () => {
    const weekdays = generateWeekdays(0);

    expect(weekdays).toHaveLength(7);
    expect(weekdays.map(({ date }) => date)).toEqual([
      "2026-08-24T00:00:00.000Z",
      "2026-08-25T00:00:00.000Z",
      "2026-08-26T00:00:00.000Z",
      "2026-08-27T00:00:00.000Z",
      "2026-08-28T00:00:00.000Z",
      "2026-08-29T00:00:00.000Z",
      "2026-08-30T00:00:00.000Z",
    ]);
    expect(weekdays[0]).toEqual(
      expect.objectContaining({
        servings: 4,
        isDisabled: false,
        recipe: null,
      })
    );
  });

  it("applies positive and negative week offsets", () => {
    expect(generateWeekdays(1)[0].date).toBe("2026-08-31T00:00:00.000Z");
    expect(generateWeekdays(-1)[0].date).toBe("2026-08-17T00:00:00.000Z");
  });
});
