import { useContext } from "react";
import { ToastContext } from "../context/toastContextValue";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast phải được dùng bên trong ToastProvider");
  return context;
}
