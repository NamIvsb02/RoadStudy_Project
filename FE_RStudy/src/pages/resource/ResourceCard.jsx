import { Download, FileText } from "lucide-react";
import { assetUrl, formatDate } from "../../utils/format";

export default function ResourceCard({ resource, canDelete = false, onDelete }) {
  const extension = resource.fileUrl.split(".").pop().toUpperCase();
  const teacherName = resource.uploadedBy?.account?.fullName;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 transition-[transform,box-shadow,border-color] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
          <FileText size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-semibold text-ink-strong">{resource.resourceName}</p>
          <p className="text-sm text-muted">{[resource.category.categoryName, teacherName].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="rounded bg-primary/10 px-2 py-0.5 font-semibold text-primary">{extension}</span>
        <span>{formatDate(resource.createdAt)}</span>
      </div>
      <div className="mt-auto flex items-center gap-4 border-t border-line pt-3">
        <a
          href={assetUrl(resource.fileUrl)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <Download size={16} />
          Tải xuống
        </a>
        {canDelete && (
          <button type="button" onClick={() => onDelete(resource)} className="inline-flex min-h-11 items-center text-sm font-semibold text-danger hover:underline">
            Xóa
          </button>
        )}
      </div>
    </article>
  );
}
