import mongoose from "mongoose";
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String },
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  imageLink: { type: String },
  diet: [{ type: String }],
  mealtype: [{ type: String }],
  youtubeLink: { type: String },
  defaultNumberOfServings: { type: Number, required: true },
  ingredients: [ingredientSchema],
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  duration: { type: Number, required: true }, // in minutes
  likes: { type: Number },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  public: { type: Boolean, default: true },
  publicId: { type: String },
});

recipeSchema.index({ title: "text", instructions: "text" });

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);

export default Recipe;
