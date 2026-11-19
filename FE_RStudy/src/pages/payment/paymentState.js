const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

export const getStage = ({ status, invoice }) => {
  if (status === "DA_THANH_TOAN") return "PAID";
  if (status === "HOAN_TIEN") return "REFUNDED";
  if (status === "DA_HUY") return "CANCELED";
  if (invoice?.status === "THAT_BAI") return "REJECTED";
  return invoice?.hasPaymentProof ? "REVIEWING" : "AWAITING";
};

export const canRefundPaid = (invoice) => Boolean(invoice?.paidAt) && Date.now() - new Date(invoice.paidAt).getTime() <= REFUND_WINDOW_MS;

export const NOTICES = {
  AWAITING: { tone: "info", text: "Chuyển khoản đúng số tiền và nội dung bên dưới, rồi gửi ảnh minh chứng để quản trị viên xác nhận." },
  REVIEWING: { tone: "info", text: "Đã gửi minh chứng. Vui lòng chờ quản trị viên xác nhận." },
  PAID: { tone: "success", text: "Thanh toán thành công. Bạn đã có thể học và làm bài thi của khóa học này." },
  REFUNDED: { tone: "muted", text: "Khoản thanh toán của đơn này đã được hoàn tiền." },
  CANCELED: { tone: "muted", text: "Đơn đăng ký này đã bị hủy." },
};

export const TONES = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  muted: "bg-muted/10 text-muted",
};
