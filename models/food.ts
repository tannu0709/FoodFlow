import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFood extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
}

const foodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Food: Model<IFood> =
  mongoose.models.Food || mongoose.model<IFood>("Food", foodSchema);

export default Food;
