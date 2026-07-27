import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string,
  description?: string | null,
  icon: string,
  color: string,
  userId: mongoose.Types.ObjectId | string,
  createdAt: Date,
  updatedAt: Date
}

const CollectionSchema = new Schema<ICollection>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

const Collection = mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;