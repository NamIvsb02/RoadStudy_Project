export const inputClass = (hasError = false, multiline = false) =>
  `${multiline ? "min-h-28 py-2" : "h-11"} w-full rounded-lg border bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:ring-2 ${
    hasError ? "border-danger focus:ring-danger/30" : "border-line focus:border-primary focus:ring-primary-light/40"
  }`;
