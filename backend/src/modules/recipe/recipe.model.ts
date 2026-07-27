import mongoose, { Schema, Document, Types } from 'mongoose';

enum DIFFICULTY { "easy", "medium", "hard" };
enum PLATFORM { "tiktok", "instagram", "youtube", "facebook", "unknown" };

export interface IIngredient extends Document {
  amount: string,
  unit: string,
  name: string
};

const IngredientSchema = new Schema<IIngredient>(
  {
    amount: { type: String, trim: true, default: '' },
    unit: { type: String, trim: true, default: '' },
    name: { type: String, required: true, trim: true }
  },
  { _id: false }
)




export interface ISource {
  platform: string,
  videoUrl: string,
  thumbnail: string | null,
  authorName: string | null,
  videoTitle: string | null
};

const SourceSchema = new Schema<ISource>(
  {
    platform: {
      type: String,
      required: true,
      enum: PLATFORM,
      lowercase: true
    },
    videoUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: null },
    authorName: { type: String, default: null },
    videoTitle: { type: String, default: null }
  },
  { _id: false }
)




export interface IRecipe extends Document {
  title: string,
  description?: string | null,
  ingredients: IIngredient[],
  steps: string[],
  tags: string[],
  servings: number,
  estimatedTime: number,
  estimatedCalories: string,
  estimatedCost: string,
  difficulty: string,
  source: ISource | null,
  aiModel: string,
  isPublic?: boolean,
  isEdited?: boolean,
  createdAt: Date,
  updatedAt: Date
};

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null
    },

    ingredients: {
      type: [IngredientSchema],
      required: true,
    },

    steps: {
      type: [String],
      required: true,
    },

    tags: {
      type: [String],
      default: []
    },

    servings: {
      type: Number,
      default: 1
    },

    estimatedTime: {
      type: Number,
      required: true,
    },

    estimatedCalories: {
      type: String,
      default: null
    },

    estimatedCost: {
      type: String,
      default: null
    },

    difficulty: {
      type: String,
      enum: DIFFICULTY,
      default: 'easy'
    },

    source: {
      type: SourceSchema,
      default: null
    },

    aiModel: {
      type: String,
    },

    isPublic: { type: Boolean, default: true },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true, }
)


const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema)

export default Recipe;