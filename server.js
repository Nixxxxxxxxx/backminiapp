// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = "@nix_ux_view";

if (!TELEGRAM_BOT_TOKEN) {
  console.error("BOT_TOKEN is not set in environment variables.");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("✅ Server is running on Render");
});

app.post("/check-subscription", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const url = 'https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_USERNAME}&user_id=${user_id}';
    const response = await axios.get(url);

    const status = response?.data?.result?.status;
    if (["member", "administrator", "creator"].includes(status)) {
      return res.json({ status: "subscribed" });
    }
    res.json({ status: "not_subscribed" });
  } catch (error) {
    console.error("Telegram API error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Telegram API error" });
  }
});

app.listen(PORT, () => {
  console.log('✅ Server running on port ${PORT}');
});
