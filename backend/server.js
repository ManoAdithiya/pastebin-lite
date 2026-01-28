import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import healthRoutes from "./routes/health.js";
import pasteRoutes from "./routes/pastes.js";
import Paste from "./models/paste.js";
import { getNow } from "./utils/time.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api", healthRoutes);
app.use("/api/pastes", pasteRoutes);


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
      .replace(/>/g, "&gt;");

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


app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
