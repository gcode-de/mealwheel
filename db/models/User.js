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

const calendarEntrySchema = new Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  date: String,
  numberOfPeople: Number,
  isDisabled: Boolean,
});
const shoppingItem = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
  isChecked: Boolean,
});

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  userName: String,
  email: String,
  profilePictureLink: { type: String },
  settings: {
    weekdaysEnabled: {},
    mealsPerDay: Number,
    defaultNumberOfPeople: Number,
    defaultDiet: [String],
    numberOfRandomMeals: Number,
  },
  recipeInteractions: [recipeInteractionSchema],
  calendar: [calendarEntrySchema],
  shoppingList: [shoppingItem],
  collections: [
    {
      collectionName: { type: String },
      recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
