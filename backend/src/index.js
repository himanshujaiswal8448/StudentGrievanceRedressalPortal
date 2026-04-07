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

// path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://himanshu-grievance.onrender.com",
];

// middlewares
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("dev"));

// static uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "../uploads")),
);

// routes
app.get("/", (req, res) => res.send("Grievance API running"));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

// test mail
app.get("/test-mail", async (req, res) => {
  try {
    await sendEmail({
      to: "himanshuku9708@gmail.com",
      subject: "SMTP Test Success",
      html: "<h1>Brevo SMTP is WORKING 🎉</h1>",
    });
    res.send("Mail sent");
  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).send("Mail failed");
  }
});

// start server
const PORT = process.env.PORT || 8080;

await connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT} 🚀`);
});

// socket setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ SINGLE CLEAN SOCKET BLOCK (FINAL)
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // join room
  socket.on("joinRoom", (complaintId) => {
    if (!complaintId) return;
    socket.join(complaintId);
    console.log(`📥 Joined room: ${complaintId}`);
  });

  // leave room
  socket.on("leaveRoom", (complaintId) => {
    if (!complaintId) return;
    socket.leave(complaintId);
    console.log(`📤 Left room: ${complaintId}`);
  });

  // send message
  socket.on("sendMessage", async ({ complaintId, message, sender }) => {
    try {
      if (!complaintId || !message || !sender) return;

      const newMsg = await ChatMessage.create({
        complaintId,
        message,
        sender,
      });

      io.to(complaintId).emit("receiveMessage", newMsg);
    } catch (err) {
      console.error("❌ SOCKET ERROR:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
