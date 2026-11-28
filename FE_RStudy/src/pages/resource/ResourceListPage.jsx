import ResourceBrowser from "./ResourceBrowser";

export default function ResourceListPage() {
  return (
    <ResourceBrowser
      header={
        <header>
          <p className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">Thư viện</p>
          <h1 className="text-headline font-bold text-ink-strong">Tài liệu</h1>
        </header>
      }
    />
  );
}
