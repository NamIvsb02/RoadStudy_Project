const entry = (label, tone) => ({ label, tone });

export const STATUS_MAPS = {
  AccountStatus: {
    CHO_XAC_MINH: entry("Chờ xác minh", "yellow"),
    HOAT_DONG: entry("Hoạt động", "green"),
    BI_KHOA: entry("Bị khóa", "red"),
  },
  ApprovalStatus: {
    CHO_DUYET: entry("Chờ duyệt", "yellow"),
    DA_DUYET: entry("Đã duyệt", "green"),
    TU_CHOI: entry("Từ chối", "red"),
  },
  FunctionStatus: {
    HOAT_DONG: entry("Hoạt động", "green"),
    NGUNG_HOAT_DONG: entry("Ngừng hoạt động", "gray"),
  },
  CategoryStatus: {
    HOAT_DONG: entry("Hoạt động", "green"),
    AN: entry("Ẩn", "gray"),
  },
  CourseStatus: {
    BAN_NHAP: entry("Bản nháp", "gray"),
    CHO_DUYET: entry("Chờ duyệt", "yellow"),
    DA_PHE_DUYET: entry("Đã phê duyệt", "blue"),
    DANG_MO: entry("Đang mở", "green"),
    TAM_NGUNG: entry("Tạm ngưng", "red"),
    DA_KET_THUC: entry("Đã kết thúc", "gray"),
  },
  RegistrationStatus: {
    CHO_THANH_TOAN: entry("Chờ thanh toán", "yellow"),
    DA_THANH_TOAN: entry("Đã thanh toán", "green"),
    HOAN_TIEN: entry("Đã hoàn tiền", "gray"),
    DA_HUY: entry("Đã hủy", "gray"),
  },
  InvoiceStatus: {
    CHO_THANH_TOAN: entry("Chờ thanh toán", "yellow"),
    DA_THANH_TOAN: entry("Đã thanh toán", "green"),
    THAT_BAI: entry("Bị từ chối", "red"),
    HOAN_TIEN: entry("Đã hoàn tiền", "gray"),
    DA_HUY: entry("Đã hủy", "gray"),
  },
  DiscountStatus: {
    HOAT_DONG: entry("Hoạt động", "green"),
    TAM_NGUNG: entry("Tạm ngưng", "yellow"),
    HET_HAN: entry("Hết hạn", "gray"),
  },
  SupportRequestStatus: {
    CHO_XU_LY: entry("Chờ xử lý", "yellow"),
    CHO_HOAN_TIEN: entry("Chờ hoàn tiền", "blue"),
    DA_XU_LY: entry("Đã xử lý", "green"),
    TU_CHOI: entry("Từ chối", "red"),
  },
  ReviewStatus: {
    CHO_DUYET: entry("Chờ duyệt", "yellow"),
    HIEN_THI: entry("Hiển thị", "green"),
    AN: entry("Đã ẩn", "gray"),
    VI_PHAM: entry("Vi phạm", "red"),
  },
  ContentStatus: {
    HIEN_THI: entry("Hiển thị", "green"),
    AN: entry("Đã ẩn", "gray"),
    VI_PHAM: entry("Vi phạm", "red"),
  },
  ReportStatus: {
    CHO_XU_LY: entry("Chờ xử lý", "yellow"),
    DANG_XU_LY: entry("Đang xử lý", "blue"),
    DA_XU_LY: entry("Đã xử lý", "green"),
    TU_CHOI: entry("Từ chối", "red"),
  },
  ExamStatus: {
    BAN_NHAP: entry("Bản nháp", "gray"),
    DA_PHE_DUYET: entry("Đã phê duyệt", "blue"),
    DANG_MO: entry("Đang mở", "green"),
    TAM_NGUNG: entry("Tạm ngưng", "red"),
  },
  AttemptStatus: {
    DANG_LAM: entry("Đang làm", "blue"),
    DA_NOP: entry("Đã nộp", "yellow"),
    DA_CHAM: entry("Đã chấm", "green"),
    HUY: entry("Đã hủy", "gray"),
  },
};
