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
  notes: [{ comment: String, date: Date }],
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
const collectionSchema = new Schema({
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  collectionName: { type: String },
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
  collections: [collectionSchema],
  publicId: { type: String },
  connectionRequests: [
    {
      senderId: mongoose.Schema.Types.ObjectId,
      timestamp: { type: Date, default: Date.now },
      message: { type: String },
      type: { type: Number },
    },
  ],
  friends: [{ type: String }],
  household: [{ id: String, role: String }],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
