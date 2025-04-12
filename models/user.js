import mongoose from "mongoose";
import MenuItem from "./menuItem";
import Rating from "./rating";
import Counter from "./counter";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (num) => /^\d{10}$/.test(num),
      message: "Invalid mobile number",
    },
  },
  wallet: { type: Number, default: 0 },
  dietaryProfile: {
    vegetarian: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    glutenFree: { type: Boolean, default: false },
    dairyFree: { type: Boolean, default: false },
  },
  HealthProfile:{
    low_carb: { type: Boolean, default: false },
    low_fat: { type: Boolean, default: false },
    low_sugar: { type: Boolean, default: false },
    low_sodium: { type: Boolean, default: false },
  },
  savedAdress: [
    {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  ],
  matrixIndex: { type: Number, unique: true, sparse: true },
  cfParams: {
    w: {
      type: [Number],
      default: () =>
        Array(10)
          .fill(0)
          .map(() => Math.random()),
    },
    b: { type: Number, default: 0 },
    lastTrained: Date,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
  recommandations: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
});

// UserSchema.pre("save", async function () {
//   if (!this.matrixIndex) {
//     const counter = await Counter.findOneAndUpdate(
//       { id: "users" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     this.matrixIndex = counter.seq;
//     const meals = await MenuItem.find();
//     const prediction = 0.5;
//     for (const meal of meals) {
//       const dietaryInfo = meal.dietaryInfo;
//       for (const [key, value] of Object.entries(dietaryInfo)) {
//         if (this.dietaryProfile[key] && !value) {
//           const rating = new Rating({
//             userIndex: this.matrixIndex,
//             menuIndex: this.matrixIndex,
//             rating: prediction,
//           });
//           await rating.save();
//           break;
//         }
//       }
//       const HealthInfo = meal.HealthInfo;
//       for (const [key, value] of Object.entries(HealthInfo)) {
//         if (this.HealthProfile[key] && !value) {
//           const rating = new Rating({
//             userIndex: this.matrixIndex,
//             menuIndex: this.matrixIndex,
//             rating: prediction,
//           });
//           await rating.save();
//           break;
//         }
//       }
//     }
//   }
// });

const User = mongoose.model("User", UserSchema);
export default User;
