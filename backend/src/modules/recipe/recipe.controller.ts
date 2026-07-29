import { Request, Response } from "express";
import { extractRecipeFromVideoLink } from "../../services/ai.service";
// import { extractRecipeFromVideoLink2 } from "../../services/ai2.service";
import { getVideoDetails } from "../../services/video.service";
import { extractRecipeFromUrl } from "../../services/videoRecipe.service";
import Recipe from "./recipe.model";
import SavedRecipe from "../saved/saved.model";
import { ExtendedRequest } from "../../middleware/auth.middleware";
import { Types } from "mongoose";

export function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=...
    const v = parsed.searchParams.get("v");
    if (v) return v;

    // youtu.be/...
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }

    // youtube.com/shorts/...
    if (parsed.pathname.startsWith("/shorts/")) {
      return parsed.pathname.split("/")[2] || null;
    }

    // youtube.com/embed/...
    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/")[2] || null;
    }

    return null;
  } catch {
    return null;
  }
}

export function getPlatform(url: string) {
  try {
    const hostname = new URL(url).hostname.replace("www.", "").toLowerCase();

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return "youtube";
    }

    if (hostname.includes("tiktok.com")) {
      return "tiktok";
    }

    if (hostname.includes("instagram.com")) {
      return "instagram";
    }

    if (hostname.includes("facebook.com") || hostname.includes("fb.watch")) {
      return "facebook";
    }

    return "unknown";
  } catch {
    return "invalid";
  }
}

export const analyzeRecipe = async (req: Request, res: Response) => {
  try {
    const { videoLink } = req.body || {};
    if (!videoLink) {
      return res.status(400).json({ error: 'Video link is required' });
    }

    const recipeDetails = await extractRecipeFromUrl(videoLink);

    // const videoDetails = await getVideoDetails(videoLink); // getting video details using yt-dlp

    // const recipeDetails = await extractRecipeFromVideoLink(videoLink);
    // const recipe = await extractRecipeFromVideoLink2(videoLink);
    // const recipeDetails = await analyzeRecipeService(videoLink);

    if (!recipeDetails.isRecipe) {
      return res.status(400).json({
        success: false,
        message:
          "The video does not contain a recipe.",
        confidence: recipeDetails.confidence,
        reason: recipeDetails.reason,
      });
    }

    const recipe = await Recipe.create({
      ...recipeDetails.recipe,
      source: {
        videoUrl: videoLink,
        platform: getPlatform(videoLink),
        thumbnail: getPlatform(videoLink) === "youtube" ? `https://i.ytimg.com/vi/${getYoutubeVideoId(videoLink)}/maxresdefault.jpg` : "",
      }
    });

    return res.json({
      success: true,
      message: 'Recipe analyzed successfully',
      data: { ...recipeDetails, recipe }
    });
  } catch (error) {
    console.error('Error in analyzeRecipe controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const createRecipe = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }

    const savedRecipeExist = await SavedRecipe.findOne({ userId: req.user?._id as Types.ObjectId, recipeId: id });
    if (savedRecipeExist) {
      return res.status(400).json({ error: 'Recipe already saved' });
    }

    await SavedRecipe.create({
      userId: req.user?._id!,
      recipeId: id as string
    });

    const recipe = await Recipe.findById(id);

    return res.json({
      success: true,
      message: 'Recipe created successfully',
      data: recipe,
    });
  } catch (error) {
    console.error('Error in createRecipe controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Recipe ID is required' });
    }
    const recipe = await Recipe.findById(id);
    return res.json({ success: true, data: recipe });
  } catch (error) {
    console.error('Error in getRecipe controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};