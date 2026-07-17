import { Schema, model } from 'mongoose';

export interface FeedbackDocument {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
  },
  {
    collection: 'feedback',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Feedback = model<FeedbackDocument>('Feedback', feedbackSchema);
