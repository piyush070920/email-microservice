require("dotenv").config();
const express = require("express");
const { sendEmail } = require("./emailservice");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running fine to serve you mail service :)");
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await sendEmail(to, subject, text, html);
  if (result.success) {
    res.status(200).json({
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } else {
    res
      .status(500)
      .json({ error: "Failed to send email", details: result.error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Email microservice running on port ${PORT}`);
});
