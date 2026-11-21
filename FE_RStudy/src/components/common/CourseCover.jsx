import { useState } from "react";
import { assetUrl } from "../../utils/format";

export default function CourseCover({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(src);

  return (
    <div className={`aspect-video w-full overflow-hidden bg-soft ${className}`}>
      {url && !failed && <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} className="size-full object-cover" />}
    </div>
  );
}
