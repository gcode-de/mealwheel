export const filterTags = [
  {
    label: "Schwierigkeit",
    type: "difficulty",
    options: [
      { label: "einfach", value: "easy" },
      { label: "mittel", value: "medium" },
      { label: "hart", value: "hard" },
    ],
  },
  {
    label: "Zubereitungsdauer",
    type: "duration",
    options: [
      { label: "<10 min", value: "&&10" },
      { label: "10-20 mon", value: "10&&20" },
      { label: ">20 min", value: "20&&" },
    ],
  },
  {
    label: "Ernährung",
    type: "diet",
    options: [
      { label: "vegan", value: "vegan" },
      { label: "vegetarisch", value: "vegetarian" },
      { label: "Fleisch", value: "meat" },
      { label: "pescetarisch", value: "pescetarian" },
      { label: "ketogen", value: "keto" },
      { label: "low carb", value: "lowcarb" },
    ],
  },
];
