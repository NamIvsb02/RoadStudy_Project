require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

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

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

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
app.use("/api/report", reportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
