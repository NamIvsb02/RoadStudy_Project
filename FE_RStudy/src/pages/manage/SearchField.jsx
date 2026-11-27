import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchField({ placeholder, label, onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form role="search" onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-11 w-full rounded-lg border border-line bg-white pr-11 pl-3 text-sm text-ink outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <button
        type="submit"
        aria-label="Tìm"
        className="absolute top-1/2 right-1 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-primary hover:bg-primary-50"
      >
        <Search size={16} />
      </button>
    </form>
  );
}
