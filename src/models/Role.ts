/* tslint:disable:variable-name */
import { model as mongooseModel, Schema } from 'mongoose';

export const description = 'Stores details of role info';

export const definitions = {
  role: { type: String, unique: true, required: true },
  displayName: { type: String, required: true },
  displayNameDiv: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  isDelete: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
};

const roleSchema: Schema = new Schema(definitions);

export const Role = mongooseModel('Role', roleSchema);
