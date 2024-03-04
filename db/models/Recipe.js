import mongoose from "mongoose";
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: String, // Optional, da im Beispiel ein leerer String als Möglichkeit angegeben wurde
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  imageLink: { type: String, required: true },
  tags: [{ type: String }], // Ein Array von Strings
  youtubeLink: { type: String },
  ingredients: [ingredientSchema], // Verwendet das obige Ingredient-Schema
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  }, // Enum, um die Schwierigkeitsgrade einzuschränken
  duration: { type: Number, required: true }, // Angenommen, dass die Dauer in Minuten angegeben wird
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
