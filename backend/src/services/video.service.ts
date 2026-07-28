import YTDlpWrap from "yt-dlp-wrap";

const ytDlp = new YTDlpWrap();

export async function getVideoDetails(videoUrl: string) {
  try {
    const info = await ytDlp.getVideoInfo(videoUrl);

    console.log(info);
    console.log("====================")
    console.dir(info, { depth: null });

    return {
      platform: info.extractor_key,
      videoUrl: info.webpage_url,
      thumbnail: info.thumbnail,
      authorName: info.uploader,
      videoTitle: info.title
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    throw new Error("Failed to fetch video details");
  }
};