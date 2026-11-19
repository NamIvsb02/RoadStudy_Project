import { assetUrl, formatDate } from "../../utils/format";

export default function ResourceCard({ resource, canDelete = false, onDelete }) {
  const extension = resource.fileUrl.split(".").pop().toUpperCase();
  const teacherName = resource.uploadedBy?.account?.fullName;

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{extension}</span>
        <span className="text-xs text-muted">{formatDate(resource.createdAt)}</span>
      </div>
      <p className="font-semibold text-ink">{resource.resourceName}</p>
      <p className="text-sm text-muted">{[resource.category.categoryName, teacherName].filter(Boolean).join(" · ")}</p>
      <div className="mt-auto flex items-center gap-4 pt-2">
        <a href={assetUrl(resource.fileUrl)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
          Tải xuống
        </a>
        {canDelete && (
          <button type="button" onClick={() => onDelete(resource)} className="text-sm font-semibold text-danger hover:underline">
            Xóa
          </button>
        )}
      </div>
    </article>
  );
}
