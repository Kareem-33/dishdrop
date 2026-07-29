import fs from "fs/promises";

import { downloadVideo } from "./videoDownloader.service";
import { uploadVideoToGemini } from "./geminiUpload.service";
import { extractRecipeFromFileUri, RecipeAnalysisResult } from "./recipeExtractor.service";
import { isYoutube } from "./platformDetector.service";

export const extractRecipeFromUrl = async (url: string): Promise<RecipeAnalysisResult> => {
  let videoPath: string | undefined;

  try {
    if (isYoutube(url)) {
      //fix https://www.youtube.com/watch?v=EKH1f-cu2dA&pp=ygUHY29va2luZw%3D%3D
      if (url.includes("&")) {
        const resultUrl = url.split("&")[0];
        return await extractRecipeFromFileUri(resultUrl || url);
      }
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