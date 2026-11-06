import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export default function SearchBox({ className = "", autoFocus = false, onSubmitted }) {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) return;
    navigate(`${ROUTES.COURSES}?search=${encodeURIComponent(value)}`);
    onSubmitted?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="Tìm kiếm khóa học"
        aria-label="Tìm kiếm khóa học"
        autoFocus={autoFocus}
        className="h-10 w-full rounded-full bg-surface pr-10 pl-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:ring-2 focus:ring-primary-light"
      />
      <button type="submit" aria-label="Tìm kiếm" className="absolute top-1/2 right-1 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-primary">
        <Search size={16} />
      </button>
    </form>
  );
}
