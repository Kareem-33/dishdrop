import youtubedl from "youtube-dl-exec";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

export const downloadVideo = async (url: string): Promise<string> => {
  // const tempDir = path.resolve("temp");
  const tempDir = path.join(process.cwd(), "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true, });
  }

  const id = randomUUID();

  const outputTemplate = path.join(tempDir, `${id}.%(ext)s`);

  await youtubedl(url, {
    output: outputTemplate,
    mergeOutputFormat: "mp4",
  });

  const files = fs.readdirSync(tempDir);

  const downloadedFile = files.find(
    (file) =>
      file.startsWith(id) &&
      file.endsWith(".mp4")
  );

  if (!downloadedFile) {
    throw new Error("Downloaded video not found");
  }

  return path.join(tempDir, downloadedFile);
};