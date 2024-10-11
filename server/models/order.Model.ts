import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
  courseId: string | null;
  testId: string | null;
  userId?: string;
  payment_info: object;
}

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      default: null, // Set default to null if no value is provided
    },
    testId: {
      type: String,
      default: null, // Set default to null if no value is provided
    },
    userId: {
      type: String,
      required: true, // Ensure userId is required
    },
    payment_info: {
      type: Object, // Type Object for flexible structure
      // required: true // Uncomment if this field is mandatory
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;
