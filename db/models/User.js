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

const collectionSchema = new Schema({
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  collectionName: { type: String },
});

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  userName: String,
  email: String,
  profilePictureLink: { type: String },
  recipeInteractions: [recipeInteractionSchema],
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
  households: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household",
    },
  ],
  activeHousehold: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
