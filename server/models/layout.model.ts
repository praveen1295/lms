import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import UUID

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface ICategory {
  _id: string; // Custom ID field
  title: string;
  examName: string;
  description: string;
  price: Number;
}

export interface IBannerImage {
  public_id: string;
  url: string;
}

interface ILayout {
  type: string;
  faq: IFaqItem[];
  categories: ICategory[];
  banner: {
    image: IBannerImage;
    title: string;
    subTitle: string;
  };
}

const faqSchema = new Schema<IFaqItem>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const categorySchema = new Schema<ICategory>({
  _id: {
    type: String,
    default: uuidv4, // Generate a unique ID using uuid
  },
  title: { type: String, required: true },
  examName: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    type: Number,
  },
});

const bannerImageSchema = new Schema<IBannerImage>({
  public_id: { type: String, required: true },
  url: { type: String, required: true },
});

const layoutSchema = new Schema<ILayout>({
  type: { type: String, required: true },
  faq: { type: [faqSchema], required: true },
  categories: { type: [categorySchema], required: true },
  banner: {
    image: { type: bannerImageSchema, required: true },
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
  },
});

const LayoutModel = model<ILayout & Document>("Layout", layoutSchema);

export default LayoutModel;
