import ResourceBrowser from "./ResourceBrowser";

export default function ResourceListPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-ink">Tài liệu</h1>
      <ResourceBrowser />
    </div>
  );
}
