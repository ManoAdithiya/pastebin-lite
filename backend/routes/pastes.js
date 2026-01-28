import express from "express";
import Paste from "../models/paste.js";
import { getNow } from "../utils/time.js";

const router = express.Router();

/* CREATE PASTE */
router.post("/", async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views && max_views < 1) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  const paste = await Paste.create({
    content,
    expiresAt,
    maxViews: max_views ?? null,
  });

  res.status(201).json({
    id: paste._id,
    url: `${process.env.BASE_URL}/p/${paste._id}`,
  });
});

/* FETCH PASTE (API) */
router.get("/:id", async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  if (paste.expiresAt && now > paste.expiresAt) {
    return res.status(404).json({ error: "Expired" });
  }

  if (paste.maxViews && paste.views >= paste.maxViews) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views: paste.maxViews
      ? paste.maxViews - paste.views
      : null,
    expires_at: paste.expiresAt,
  });
});

export default router;
