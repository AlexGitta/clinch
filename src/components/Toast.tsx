import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

const ToastContext = createContext<{ show: (message: string, type?: ToastType) => void }>({
  show: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const colorMap: Record<ToastType, string> = {
    success: "border-green-500/40 bg-green-500/10 text-green-700",
    error: "border-red-500/40 bg-red-500/10 text-red-700",
    info: "border-[var(--line)] bg-[var(--card)] text-[var(--ink)]",
  };

  const darkColorMap: Record<ToastType, string> = {
    success: "dark-toast-success",
    error: "dark-toast-error",
    info: "",
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed right-5 top-5 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-slide-in rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${colorMap[toast.type]} ${darkColorMap[toast.type]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
