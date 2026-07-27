export const getPlatform = (url: string) => {
  const lower = url.toLowerCase();

  if (
    lower.includes("youtube.com") ||
    lower.includes("youtu.be")
  ) {
    return "youtube";
  }

  if (lower.includes("tiktok.com")) {
    return "tiktok";
  }

  if (lower.includes("instagram.com")) {
    return "instagram";
  }

  if (lower.includes("facebook.com")) {
    return "facebook";
  }

  return "unknown";
};

export const isYoutube = (url: string) =>
  getPlatform(url) === "youtube";