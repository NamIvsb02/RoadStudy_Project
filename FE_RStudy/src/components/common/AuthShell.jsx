export default function AuthShell({ welcome, subtitle, title, children }) {
  return (
    <div className="mx-auto grid max-w-5xl lg:grid-cols-2 lg:gap-12">
      <div className="hidden flex-col justify-center lg:flex">
        <h2 className="text-4xl font-bold text-primary-dark">{welcome}</h2>
        {subtitle && <p className="mt-3 max-w-sm text-muted">{subtitle}</p>}
      </div>
      <section className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-wide text-primary-dark uppercase">{title}</h1>
        {children}
      </section>
    </div>
  );
}
