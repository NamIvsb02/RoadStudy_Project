require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const requestId = require("./middlewares/requestId");

// ===== Routes - 17 module =====
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const courseRoutes = require("./routes/courseRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const couponRoutes = require("./routes/couponRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const commentRoutes = require("./routes/commentRoutes");
const examRoutes = require("./routes/examRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const learningRoutes = require("./routes/learningRoutes");

const prisma = require("./config/database"); // ngoại lệ có chủ đích: chỉ để đóng kết nối khi tắt server

const app = express();
app.set("trust proxy", Number(process.env.TRUST_PROXY) || 0); // đặt TRUST_PROXY=1 khi chạy sau nginx/reverse proxy để rate limit lấy đúng IP

app.use(requestId); // đầu tiên, để mọi log và lỗi đều có mã truy vết
app.use(helmet());
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim());
app.use(cors({ origin: corsOrigins }));
morgan.token("id", (req) => req.id);
app.use(
  morgan(
    process.env.NODE_ENV === "production"
      ? ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
      : ":id :method :url :status :response-time ms",
  ),
);
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" })); // process còn sống

// Sẵn sàng phục vụ: kiểm tra được kết nối tới database
app.get("/health/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (err) {
    console.error(`[${req.id}] Health ready lỗi:`, err.message);
    res.status(503).json({ status: "unavailable" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/resource", resourceRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/submission", submissionRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/report", reportRoutes);

// ===== Static Uploads =====
["avatars", "covers", "resources"].forEach((folder) => {
  app.use(
    `/uploads/${folder}`,
    express.static(path.join(__dirname, "..", "uploads", folder), {
      setHeaders: (res) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Tắt an toàn: ngừng nhận request mới, chờ request đang chạy xong rồi đóng kết nối DB
const shutdown = (signal) => {
  console.log(`Nhận ${signal}, đang tắt server...`);
  setTimeout(() => process.exit(1), 10000).unref(); // quá 10 giây thì ép thoát
  server.close(async () => {
    await prisma.$disconnect().catch(() => {});
    console.log("Đã đóng kết nối, tắt server.");
    process.exit(0);
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
