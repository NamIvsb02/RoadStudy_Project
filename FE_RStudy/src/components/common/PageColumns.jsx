export default function PageColumns({ left, right, children }) {
  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      {left && <aside className="w-full shrink-0 lg:w-60">{left}</aside>}
      <div className="min-w-0 flex-1">{children}</div>
      {right && (
        <aside className="order-first w-full shrink-0 lg:sticky lg:top-20 lg:order-last lg:w-80 lg:self-start">
          {right}
        </aside>
      )}
    </div>
  );
}
