import { Type } from "@google/genai";
import { ai } from "../config/gemini";

interface Recipe {
  title: string;
  description: string;
  ingredients: {
    amount: string;
    unit: string;
    name: string;
  }[];
  steps: string[];
  tags: string[];
  servings: number;
  estimatedTime: number;
  estimatedCalories: string;
  estimatedCost: string;
  difficulty: "easy" | "medium" | "hard";
}

const normalizeUnit = (unit: string): string => {
  const map: Record<string, string> = {
    grams: "g",
    gram: "g",
    g: "g",

    kilograms: "kg",
    kilogram: "kg",
    kg: "kg",

    milliliters: "ml",
    milliliter: "ml",
    ml: "ml",

    liters: "l",
    liter: "l",
    l: "l",

    teaspoon: "tsp",
    teaspoons: "tsp",
    tsp: "tsp",

    tablespoon: "tbsp",
    tablespoons: "tbsp",
    tbsp: "tbsp",

    cups: "cup",
    cup: "cup",

    pieces: "piece",
    piece: "piece",

    cloves: "clove",
    clove: "clove",
  };

  return map[unit?.toLowerCase()] || unit;
};

const normalizeCalories = (value: string): string => {
  const match = value?.match(/\d+/);

  if (!match) return "0 kcal";

  return `${match[0]} kcal`;
};

const normalizeCost = (value: string): string => {
  const match = value?.match(/\d+(\.\d+)?/);

  if (!match) return "$0";

  return `$${match[0]}`;
};

const normalizeRecipe = (recipe: Recipe): Recipe => {
  return {
    title: recipe.title.trim(),

    description: recipe.description.trim(),

    ingredients: recipe.ingredients.map((ingredient) => ({
      amount: String(ingredient.amount).trim(),
      unit: normalizeUnit(ingredient.unit),
      name: ingredient.name.trim().toLowerCase(),
    })),

    steps: recipe.steps.map(
      (step) => step.trim().replace(/\.$/, "") + "."
    ),

    tags: [
      ...new Set(
        recipe.tags.map((tag) =>
          tag.trim().toLowerCase()
        )
      ),
    ],

    servings: Number(recipe.servings) || 1,

    estimatedTime: Number(recipe.estimatedTime) || 0,

    estimatedCalories: normalizeCalories(
      recipe.estimatedCalories
    ),

    estimatedCost: normalizeCost(
      recipe.estimatedCost
    ),

    difficulty:
      recipe.difficulty?.toLowerCase() === "hard"
        ? "hard"
        : recipe.difficulty?.toLowerCase() === "medium"
        ? "medium"
        : "easy",
  };
};

export const extractRecipeFromVideoLink = async (
  videoLink: string
): Promise<Recipe> => {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",

    contents: [
      {
        fileData: {
          fileUri: videoLink,
        },
      },
      {
        text: `
You are a professional recipe extraction engine.

Analyze the cooking video carefully.

Observe:
- Visual ingredients
- Cooking actions
- Text overlays
- Spoken instructions

Extract ONLY the recipe shown.

STRICT RULES:

1. Return ONLY JSON.
2. Follow the schema exactly.
3. Never return null.
4. If quantity is not visible, estimate realistically.
5. Use standardized units:
   g, kg, ml, l, tsp, tbsp, cup, piece, clove
6. Title must be short.
7. Description must be 1-2 sentences.
8. Steps must be concise cooking instructions.
9. Tags must be lowercase.
10. Calories format:
    "550 kcal"
11. Cost format:
    "$8"
12. Difficulty:
    easy | medium | hard

EXAMPLE OUTPUT:

{
  "title": "Chicken Shawarma",
  "description": "Homemade Middle Eastern chicken shawarma served in pita bread.",
  "ingredients": [
    {
      "amount": "500",
      "unit": "g",
      "name": "chicken breast"
    },
    {
      "amount": "2",
      "unit": "tbsp",
      "name": "greek yogurt"
    }
  ],
  "steps": [
    "Mix the yogurt and spices.",
    "Marinate the chicken.",
    "Cook the chicken until browned."
  ],
  "tags": [
    "middle eastern",
    "chicken",
    "shawarma"
  ],
  "servings": 4,
  "estimatedTime": 45,
  "estimatedCalories": "550 kcal",
  "estimatedCost": "$8",
  "difficulty": "medium"
}

Now analyze the provided video.
`,
      },
    ],

    config: {
      thinkingConfig: {
        thinkingBudget: 2048,
      },

      responseMimeType: "application/json",

      responseSchema: {
        type: Type.OBJECT,

        properties: {
          title: {
            type: Type.STRING,
          },

          description: {
            type: Type.STRING,
          },

          ingredients: {
            type: Type.ARRAY,

            items: {
              type: Type.OBJECT,

              properties: {
                amount: {
                  type: Type.STRING,
                },

                unit: {
                  type: Type.STRING,
                },

                name: {
                  type: Type.STRING,
                },
              },

              required: [
                "amount",
                "unit",
                "name",
              ],
            },
          },

          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          tags: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          servings: {
            type: Type.INTEGER,
          },

          estimatedTime: {
            type: Type.INTEGER,
          },

          estimatedCalories: {
            type: Type.STRING,
          },

          estimatedCost: {
            type: Type.STRING,
          },

          difficulty: {
            type: Type.STRING,
            enum: ["easy", "medium", "hard"],
          },
        },

        required: [
          "title",
          "description",
          "ingredients",
          "steps",
          "tags",
          "servings",
          "estimatedTime",
          "estimatedCalories",
          "estimatedCost",
          "difficulty",
        ],
      },
    },
  });

  const rawRecipe = JSON.parse(
    response.text as string
  ) as Recipe;

  return normalizeRecipe(rawRecipe);
};