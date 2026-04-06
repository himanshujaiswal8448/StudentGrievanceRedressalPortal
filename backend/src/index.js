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
import chatRoutes from "./routes/chat.routes.js";

import { sendEmail } from "./services/mailService.js";
import { Server } from "socket.io";
import ChatMessage from "./models/ChatMessage.js";

const app = express();

// ✅ path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ middlewares
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://himanshu-grievance.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("dev"));

// ✅ static uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads")),
);

// ✅ routes
app.get("/", (req, res) => res.send("Grievance API running"));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// ✅ test mail
app.get("/test-mail", async (req, res) => {
  await sendEmail({
    to: "himanshuku9708@gmail.com",
    subject: "SMTP Test Success",
    html: "<h1>Brevo SMTP is WORKING 🎉</h1>",
  });
  res.send("Mail sent");
});

// ✅ PORT
const PORT = process.env.PORT || 8080;

// ✅ connect DB first
await connectDB();

// ✅ start server ONLY ONCE
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT} 🚀`);
});

// ✅ socket setup (IMPORTANT)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

// ✅ socket logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // join room
  socket.on("joinRoom", (complaintId) => {
    socket.join(complaintId);
  });

  // send message
  socket.on("sendMessage", async ({ complaintId, message, sender }) => {
    try {
      console.log("📩 MESSAGE:", { complaintId, message, sender });

      const newMsg = await ChatMessage.create({
        complaintId,
        message,
        sender,
      });

      // emit to room
      io.to(complaintId).emit("receiveMessage", newMsg);
    } catch (err) {
      console.error("❌ CHAT ERROR:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
