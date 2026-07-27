import mongoose, {Schema, Document} from 'mongoose';

export interface ISavedRecipe extends Document {
  userId: mongoose.Types.ObjectId | string,
  recipeId: mongoose.Types.ObjectId | string,
  collectionId: mongoose.Types.ObjectId | string | null,
  createdAt: Date,
  updatedAt: Date
}

const SavedRecipeSchema = new Schema<ISavedRecipe>({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  recipeId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Recipe'
  },
  collectionId: {
    type: Schema.ObjectId,
    ref: 'Collection',
    default: null,
    required: false
  }
}, { timestamps: true });

const SavedRecipe = mongoose.model<ISavedRecipe>('SavedRecipe', SavedRecipeSchema);

export default SavedRecipe;