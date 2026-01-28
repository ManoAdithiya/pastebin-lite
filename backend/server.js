import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import healthRoutes from "./routes/health.js";
import pasteRoutes from "./routes/pastes.js";
import Paste from "./models/paste.js"; // ✅ FIX
import { getNow } from "./utils/time.js"; // ✅ FIX

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection with error handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api", healthRoutes);
app.use("/api/pastes", pasteRoutes);

// View paste as HTML
app.get("/p/:id", async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);
    if (!paste) return res.sendStatus(404);

    const now = getNow(req);

    if (paste.expiresAt && now > paste.expiresAt) {
      return res.sendStatus(404);
    }

    if (paste.maxViews && paste.views >= paste.maxViews) {
      return res.sendStatus(404);
    }

    paste.views += 1;
    await paste.save();

    const safeContent = paste.content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;"); // ✅ extra safety

    res.send(`
      <html>
        <body>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
