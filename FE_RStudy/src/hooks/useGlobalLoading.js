import { useContext } from "react";
import { LoadingContext } from "../context/loadingContextValue";

// const loading = useGlobalLoading(); await loading.run(() => api.call(), "Đang lưu thay đổi...");
export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useGlobalLoading phải được dùng bên trong LoadingProvider");
  return context;
}
