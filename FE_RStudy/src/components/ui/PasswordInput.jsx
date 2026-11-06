import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClass } from "./inputClass";

const PasswordInput = forwardRef(function PasswordInput({ hasError = false, className = "", ...props }, ref) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input ref={ref} type={visible ? "text" : "password"} aria-invalid={hasError} className={`${inputClass(hasError)} pr-11 ${className}`} {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:text-primary"
      >
        <Icon size={16} />
      </button>
    </div>
  );
});

export default PasswordInput;
