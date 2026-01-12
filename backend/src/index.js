import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { sendEmail } from "./services/mailService.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => res.send("Grievance API running"));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

app.get("/test-mail", async (req, res) => {
  await sendEmail({
    to: "YOUR_PERSONAL_EMAIL@gmail.com",
    subject: "SMTP Test Success",
    html: "<h1>Brevo SMTP is WORKING 🎉</h1>",
  });
  res.send("Mail sent");
});

const PORT = process.env.PORT || 8080;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT} 🚀`))
);
