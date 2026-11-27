import { useState } from "react";
import { assetUrl } from "../../utils/format";

export default function CourseCover({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(src);

  return (
    <div className={`aspect-video w-full overflow-hidden bg-surface ${className}`}>
      {url && !failed && (
        <img
          src={url}
          alt={alt}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover transition-transform duration-400 ease-out-soft group-hover:scale-105"
        />
      )}
    </div>
  );
}
