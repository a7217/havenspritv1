import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Contact = models.Contact || model<IContact>("Contact", ContactSchema);
