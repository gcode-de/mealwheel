import validateShoppinglistItems from "@/helpers/OpenAI/validateShoppinglistItems";

describe("validateShoppinglistItems", () => {
  it("accepts categorized items with optional checked state", () => {
    expect(
      validateShoppinglistItems([
        {
          category: "Obst & Gemüse",
          items: [
            { name: "Äpfel", isChecked: false },
            { name: "Tomaten" },
          ],
        },
      ])
    ).toBe(true);
  });

  it.each([
    [null],
    [{}],
    [{ category: "Obst & Gemüse", items: null }],
    [{ category: "Obst & Gemüse", items: [null] }],
    [{ category: "Obst & Gemüse", items: [{ name: 42 }] }],
    ["not an array"],
  ])("rejects malformed AI output without throwing", (value) => {
    expect(() => validateShoppinglistItems(value)).not.toThrow();
    expect(validateShoppinglistItems(value)).toBe(false);
  });
});
