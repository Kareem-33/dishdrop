import { client } from "../config/openrouter";

export interface IExtractedRecipe {
  title: string | null;
  description: string | null;
  ingredients: {
    amount: string;
    unit: string;
    name: string;
  }[];
  steps: string[];
  servings: number | null;
  estimatedTime: number | null;
  difficulty: "easy" | "medium" | "hard";
}

export const extractRecipeFromVideoLink2 = async (
  videoLink: string
): Promise<IExtractedRecipe> => {
  const response = await client.chat.completions.create({
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",

    messages: [
      {
        role: "user",
        content: `
Video URL:
${videoLink}

Analyze this cooking video and extract the recipe.

Return ONLY valid JSON:

{
  "title": null,
  "description": null,
  "ingredients": [],
  "steps": [],
  "servings": null,
  "estimatedTime": null,
  "difficulty": "easy"
}
`,
      },
    ],

    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response received");
  }

  return JSON.parse(content);
};