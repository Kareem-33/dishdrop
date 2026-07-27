import fs from "fs/promises";

import { downloadVideo } from "./videoDownloader.service";
import { uploadVideoToGemini } from "./geminiUpload.service";
import { extractRecipeFromFileUri, RecipeAnalysisResult } from "./recipeExtractor.service";
import { isYoutube } from "./platformDetector.service";

export const extractRecipeFromUrl = async (url: string): Promise<RecipeAnalysisResult> => {
  let videoPath: string | undefined;

  try {
    if (isYoutube(url)) {
      return await extractRecipeFromFileUri(url);
    }

    videoPath = await downloadVideo(url);

    const fileUri = await uploadVideoToGemini(videoPath);

    return await extractRecipeFromFileUri(fileUri as string);
  } finally {
    if (videoPath) {
      await fs.unlink(videoPath).catch(() => { });
    }
  }
};