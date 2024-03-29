function isValidCategoryItem(item) {
  return (
    typeof item === "object" &&
    typeof item.name === "string" &&
    // typeof item.quantity === "number" &&
    // typeof item.unit === "string" &&
    (typeof item.isChecked === "boolean" ||
      typeof item.isChecked === "undefined")
  );
}

function isValidCategoryStructure(category) {
  return (
    typeof category === "object" &&
    typeof category.category === "string" &&
    Array.isArray(category.items) &&
    category.items.every(isValidCategoryItem)
  );
}

export default function validateShoppinglistItems(aiData) {
  return Array.isArray(aiData) && aiData.every(isValidCategoryStructure);
}
