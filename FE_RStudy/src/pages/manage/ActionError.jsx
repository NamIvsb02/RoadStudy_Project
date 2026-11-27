export default function ActionError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
      {message}
    </p>
  );
}
