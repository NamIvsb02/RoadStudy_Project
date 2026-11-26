export const inputClass = (hasError = false, multiline = false) =>
  `${multiline ? "min-h-28 py-2" : "h-11"} w-full rounded-lg border bg-white px-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out-soft placeholder:text-muted focus:ring-2 ${
    hasError
      ? "border-danger focus:ring-danger/30"
      : "border-line hover:border-line-strong focus:border-primary focus:ring-primary-light/40"
  }`;
