// import { Type } from "@google/genai";
// import { ai } from "../config/gemini";

// export const extractRecipeFromFileUri = async (
//   fileUri: string
// ) => {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",

//     contents: [
//       {
//         fileData: {
//           fileUri,
//         },
//       },
//       {
//         text: `
// Analyze this recipe video.

// Return ONLY JSON.
// Never return null.
// Estimate missing quantities realistically.

// Extract:
// - title
// - description
// - ingredients
// - steps
// - tags
// - servings
// - estimatedTime
// - estimatedCalories
// - estimatedCost
// - difficulty
// `,
//       },
//     ],

//     config: {
//       responseMimeType: "application/json",

//       responseSchema: {
//         type: Type.OBJECT,

//         properties: {
//           title: {
//             type: Type.STRING,
//           },

//           description: {
//             type: Type.STRING,
//           },

//           ingredients: {
//             type: Type.ARRAY,

//             items: {
//               type: Type.OBJECT,

//               properties: {
//                 amount: {
//                   type: Type.STRING,
//                 },

//                 unit: {
//                   type: Type.STRING,
//                 },

//                 name: {
//                   type: Type.STRING,
//                 },
//               },

//               required: [
//                 "amount",
//                 "unit",
//                 "name",
//               ],
//             },
//           },

//           steps: {
//             type: Type.ARRAY,
//             items: {
//               type: Type.STRING,
//             },
//           },

//           tags: {
//             type: Type.ARRAY,
//             items: {
//               type: Type.STRING,
//             },
//           },

//           servings: {
//             type: Type.INTEGER,
//           },

//           estimatedTime: {
//             type: Type.INTEGER,
//           },

//           estimatedCalories: {
//             type: Type.STRING,
//           },

//           estimatedCost: {
//             type: Type.STRING,
//           },

//           difficulty: {
//             type: Type.STRING,
//             enum: [
//               "easy",
//               "medium",
//               "hard",
//             ],
//           },
//         },

//         required: [
//           "title",
//           "description",
//           "ingredients",
//           "steps",
//           "tags",
//           "servings",
//           "estimatedTime",
//           "estimatedCalories",
//           "estimatedCost",
//           "difficulty",
//         ],
//       },
//     },
//   });

//   return JSON.parse(
//     response.text as string
//   );
// };


import { Type } from "@google/genai";
import { ai } from "../config/gemini";

export interface Recipe {
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

export interface RecipeAnalysisResult {
  isRecipe: boolean;
  confidence: number;
  reason: string;
  recipe: Recipe | null;
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

export const extractRecipeFromFileUri = async (
  fileUri: string
): Promise<RecipeAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        fileData: {
          fileUri,
        },
      },
      {
        text: `
You are a professional recipe extraction engine.

FIRST determine whether this video is actually a cooking or recipe video.

A recipe video MUST contain:
- Food preparation
- Ingredients
- Cooking actions
- A prepared dish

If the video is not a recipe video:
- Set isRecipe=false
- Set confidence appropriately
- Explain why in reason
- Set recipe=null

NEVER invent recipes.

If it is a recipe video:
- Set isRecipe=true
- Extract the recipe exactly

STRICT RULES:

1. Return ONLY JSON.
2. Never return null except for recipe when isRecipe=false.
3. Estimate ingredient quantities realistically.
4. Use standardized units:
   g, kg, ml, l, tsp, tbsp, cup, piece, clove
5. Tags must be lowercase.
6. Calories format: "550 kcal"
7. Cost format: "$8"
8. Difficulty: easy | medium | hard
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
          isRecipe: {
            type: Type.BOOLEAN,
          },

          confidence: {
            type: Type.INTEGER,
          },

          reason: {
            type: Type.STRING,
          },

          recipe: {
            type: Type.OBJECT,

            nullable: true,

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
                enum: [
                  "easy",
                  "medium",
                  "hard",
                ],
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

        required: [
          "isRecipe",
          "confidence",
          "reason",
          "recipe",
        ],
      },
    },
  });

  const result = JSON.parse(
    response.text as string
  ) as RecipeAnalysisResult;

  if (result.recipe) {
    result.recipe = normalizeRecipe(
      result.recipe
    );
  }

  return result;
};