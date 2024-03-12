import mongoose from "mongoose";
const { Schema } = mongoose;

async function cleanupRecipeReferences(recipeId) {
  try {
    await mongoose
      .model("User")
      .updateMany(
        { "recipeInteractions.recipe": recipeId },
        { $pull: { recipeInteractions: { recipe: recipeId } } }
      );

    await mongoose
      .model("User")
      .updateMany(
        { "calendar.recipe": recipeId },
        { $pull: { calendar: { recipe: recipeId } } }
      );
  } catch (error) {
    console.error("Fehler beim Bereinigen der Rezeptreferenzen: ", error);
    throw error;
  }
}

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String }, // Optional, da im Beispiel ein leerer String als Möglichkeit angegeben wurde
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  imageLink: { type: String },
  tags: [{ type: String }], // Ein Array von Strings
  youtubeLink: { type: String },
  ingredients: [ingredientSchema], // Verwendet das obige Ingredient-Schema
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  }, // Enum, um die Schwierigkeitsgrade einzuschränken
  duration: { type: Number, required: true }, // Angenommen, dass die Dauer in Minuten angegeben wird
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
export { cleanupRecipeReferences };
