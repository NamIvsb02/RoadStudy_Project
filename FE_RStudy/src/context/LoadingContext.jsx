import { useCallback, useMemo, useState } from "react";
import GlobalLoadingOverlay from "../components/common/GlobalLoadingOverlay";
import { LoadingContext } from "./loadingContextValue";

const DEFAULT_MESSAGE = "Đang tải dữ liệu...";
let nextId = 0;

export function LoadingProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Mỗi tác vụ được đếm riêng: nhiều tác vụ chạy cùng lúc thì lớp phủ giữ tới khi tác vụ cuối cùng xong (thành công hay lỗi),
  // nội dung hiển thị theo tác vụ bắt đầu gần nhất. Không có thời gian chờ giả: đóng ngay khi promise kết thúc.
  const run = useCallback(async (task, message = DEFAULT_MESSAGE) => {
    nextId += 1;
    const id = nextId;
    setTasks((list) => [...list, { id, message }]);
    try {
      return await task();
    } finally {
      setTasks((list) => list.filter((item) => item.id !== id));
    }
  }, []);

  const api = useMemo(() => ({ run }), [run]);
  const current = tasks.at(-1);

  return (
    <LoadingContext.Provider value={api}>
      {children}
      <GlobalLoadingOverlay open={tasks.length > 0} message={current?.message ?? DEFAULT_MESSAGE} />
    </LoadingContext.Provider>
  );
}
