import { useState } from "react";
import { assetUrl, getInitials } from "../../utils/format";

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-2xl",
  xl: "size-24 text-3xl",
};

export default function Avatar({ name, src, size = "md", className = "" }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const url = assetUrl(src);
  const box = `${SIZES[size] || SIZES.md} shrink-0 rounded-full overflow-hidden ${className}`;

  if (url && failedUrl !== url) {
    return <img src={url} alt={name ?? ""} onError={() => setFailedUrl(url)} className={`${box} object-cover`} />;
  }

  return <span className={`${box} inline-flex items-center justify-center bg-primary font-semibold text-white`}>{getInitials(name)}</span>;
}
