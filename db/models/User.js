const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeInteractionSchema = new Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  isFavorite: Boolean,
  hasCooked: Boolean,
  rating: Number,
  notes: String,
});

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  userName: String,
  email: String,
  settings: {
    weekdaysEnabled: [{ day: String, enabled: Boolean }],
    mealsPerDay: Number,
    defaultNumberOfPeople: Number,
    defaultDiet: [String],
    numberOfRandomMeals: Number,
  },
  recipeInteractions: [recipeInteractionSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
