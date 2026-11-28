import { courseApi } from "../../../api/courseApi";

export const STEPS = {
  CHO_DUYET: [
    { key: "approve", label: "Duyệt" },
    { key: "reject", label: "Từ chối" },
  ],
  DA_PHE_DUYET: [{ key: "DANG_MO", label: "Mở đăng ký" }],
  DANG_MO: [
    { key: "TAM_NGUNG", label: "Tạm ngưng" },
    { key: "DA_KET_THUC", label: "Kết thúc" },
  ],
  TAM_NGUNG: [
    { key: "DANG_MO", label: "Mở lại" },
    { key: "DA_KET_THUC", label: "Kết thúc" },
  ],
};

export const CONFIRMS = {
  approve: { title: "Duyệt khóa học?", message: "Khóa học chuyển sang Đã phê duyệt, bạn mở đăng ký sau.", label: "Duyệt" },
  DANG_MO: { title: "Mở đăng ký khóa học?", message: "Học viên sẽ thấy và đăng ký được khóa học này.", label: "Mở đăng ký" },
  TAM_NGUNG: { title: "Tạm ngưng khóa học?", message: "Khóa học sẽ không hiển thị với học viên cho đến khi mở lại.", label: "Tạm ngưng" },
  DA_KET_THUC: { title: "Kết thúc khóa học?", message: "Khóa học đã kết thúc không thể mở lại.", label: "Kết thúc", danger: true },
};

// Admin sửa được mọi trạng thái trừ khóa đã kết thúc (khớp PUT /course/:id ở BE)
export const canAdminEdit = (course) => course.status !== "DA_KET_THUC";

export const runAction = (course, key, reason) => {
  if (key === "approve") return courseApi.approve(course.id);
  if (key === "reject") return courseApi.reject(course.id, reason);
  return courseApi.changeStatus(course.id, key);
};
