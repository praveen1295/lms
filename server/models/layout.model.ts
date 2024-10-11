import { Schema, model, Document } from "mongoose";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface ICategory {
  title: string;
  value: string;
  description: string;
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
  question: { type: String, required: true }, // Required field added
  answer: { type: String, required: true }, // Required field added
});

const categorySchema = new Schema<ICategory>({
  title: { type: String, required: true }, // Required field added
  value: { type: String, required: true }, // Required field added
  description: { type: String, required: true }, // Required field added
});

const bannerImageSchema = new Schema<IBannerImage>({
  public_id: { type: String, required: true }, // Required field added
  url: { type: String, required: true }, // Required field added
});

const layoutSchema = new Schema<ILayout>({
  type: { type: String, required: true }, // Required field added
  faq: { type: [faqSchema], required: true }, // Ensure the array of faq items is required
  categories: { type: [categorySchema], required: true }, // Ensure the array of categories is required
  banner: {
    image: { type: bannerImageSchema, required: true }, // Required field added
    title: { type: String, required: true }, // Required field added
    subTitle: { type: String, required: true }, // Required field added
  },
});

const LayoutModel = model<ILayout & Document>("Layout", layoutSchema);

export default LayoutModel;
