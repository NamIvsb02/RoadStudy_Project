import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Toast from "../components/ui/Toast";
import { ToastContext } from "./toastContextValue";

const DURATION = 4000;
let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((item) => item.id !== id));
  }, []);

  const show = useCallback(
    (type, message) => {
      nextId += 1;
      const id = nextId;
      setToasts((list) => [...list, { id, type, message }]);
      window.setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      warning: (message) => show("warning", message),
      info: (message) => show("info", message),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="fixed top-20 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((item) => (
            <Toast key={item.id} toast={item} onClose={() => dismiss(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
