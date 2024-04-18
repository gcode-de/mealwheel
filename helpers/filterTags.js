export const filterTags = [
  {
    label: "Schwierigkeit",
    type: "difficulty",
    options: [
      { label: "Anfänger", value: "easy" },
      { label: "Fortgeschritten", value: "medium" },
      { label: "Profi", value: "hard" },
    ],
  },
  {
    label: "Zubereitungsdauer",
    type: "duration",
    options: [
      { label: "<10 min", value: "&&10" },
      { label: "10-20 min", value: "10&&20" },
      { label: ">20 min", value: "20&&" },
    ],
  },
  {
    label: "Ernährung",
    type: "diet",
    options: [
      { label: "vegan", value: "vegan" },
      { label: "vegetarisch", value: "vegetarian", includes: ["vegan"] },
      { label: "Fleisch", value: "meat" },
      {
        label: "pescetarisch",
        value: "pescetarian",
        includes: ["vegan", "vegetarian"],
      },
      { label: "ketogen", value: "keto" },
      { label: "low carb", value: "low carb" },
    ],
  },
  {
    label: "Anlass",
    type: "mealtype",
    options: [
      { label: "Hauptgericht", value: "main" },
      { label: "Dessert", value: "dessert" },
      { label: "Frühstück", value: "breakafast" },
      { label: "Snack", value: "snack" },
      { label: "Suppe", value: "soup" },
      { label: "Salat", value: "salad" },
    ],
  },
];

export function getFilterLabelByValue(value) {
  for (const filter of filterTags) {
    const optionFound = filter.options.find((option) => option.value === value);

    if (optionFound) {
      return optionFound.label;
    }
  }

  return undefined;
}

export async function expandDietCategories(dietArray) {
  const dietOptions = filterTags.find((tag) => tag.type === "diet").options;
  const expandedDiets = new Set(dietArray);

  dietArray.forEach((diet) => {
    const option = dietOptions.find((opt) => opt.value === diet);
    if (option && option.includes) {
      option.includes.forEach((includedDiet) =>
        expandedDiets.add(includedDiet)
      );
    }
  });
  return Array.from(expandedDiets);
}
