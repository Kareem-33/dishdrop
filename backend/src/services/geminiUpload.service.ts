import { ai } from "../config/gemini";

export const uploadVideoToGemini = async (videoPath: string) => {
  const uploadedFile = await ai.files.upload({
    file: videoPath,
    config: {
      mimeType: "video/mp4",
    },
  });

  let file = await ai.files.get({ name: uploadedFile.name as string });

  while (file.state !== "ACTIVE") {
    if (file.state === "FAILED") {
      throw new Error("Gemini failed to process the video");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    file = await ai.files.get({ name: uploadedFile.name as string });
  }

  return file.uri!;
};