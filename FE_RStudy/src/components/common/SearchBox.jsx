import { useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { generatePath, useNavigate } from "react-router-dom";
import { courseApi } from "../../api/courseApi";
import { dropdown } from "../../constants/motion";
import { ROUTES } from "../../constants/routes";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import SearchSuggestions from "./SearchSuggestions";

const MIN_LENGTH = 2;
const MAX_LENGTH = 100;
const SUGGESTION_LIMIT = 6;
const DEBOUNCE_MS = 300;

export default function SearchBox({ className = "", inputClassName = "", autoFocus = false, onSubmitted, onActiveChange }) {
  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index) => `${baseId}-option-${index}`;

  const trimmed = keyword.trim();
  const debounced = useDebouncedValue(trimmed, DEBOUNCE_MS);
  const enabled = debounced.length >= MIN_LENGTH;
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["course-suggestions", debounced],
    queryFn: async () => (await courseApi.getPublicList({ q: debounced, limit: SUGGESTION_LIMIT })).data.items,
    enabled,
    staleTime: 30_000,
  });

  const items = enabled && debounced === trimmed ? (data ?? []) : [];
  const typing = trimmed !== debounced || (isFetching && !data);
  let status = "ready";
  if (typing) status = "loading";
  else if (isError) status = "error";
  else if (items.length === 0) status = "empty";
  const panelOpen = open && trimmed.length >= MIN_LENGTH;

  const finish = () => {
    setOpen(false);
    setActiveIndex(-1);
    setKeyword("");
    inputRef.current?.blur();
    onSubmitted?.();
  };

  const showAll = () => {
    if (!trimmed) return;
    navigate(`${ROUTES.COURSES}?q=${encodeURIComponent(trimmed)}`);
    finish();
  };

  const selectCourse = (course) => {
    navigate(generatePath(ROUTES.COURSE_DETAIL, { id: course.id }));
    finish();
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, items.length - 1));
    } else if (event.key === "ArrowUp" && items.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter" && panelOpen && items[activeIndex]) {
      event.preventDefault();
      selectCourse(items[activeIndex]);
    } else if (event.key === "Escape" && panelOpen) {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    } else if (event.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        showAll();
      }}
      onFocus={() => onActiveChange?.(true)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setOpen(false);
        onActiveChange?.(false);
      }}
      className={`relative ${className}`}
    >
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        value={keyword}
        maxLength={MAX_LENGTH}
        onChange={(event) => {
          setKeyword(event.target.value);
          setActiveIndex(-1);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm khóa học"
        aria-label="Tìm kiếm khóa học"
        aria-autocomplete="list"
        aria-expanded={panelOpen}
        aria-controls={listId}
        aria-activedescendant={panelOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        autoFocus={autoFocus}
        className={`h-10 w-full rounded-full bg-surface pr-10 pl-4 text-sm text-ink outline-none transition-[box-shadow,background-color] duration-150 placeholder:text-muted hover:bg-primary-50 focus:ring-2 focus:ring-primary-light ${inputClassName}`}
      />
      <button type="submit" aria-label="Tìm kiếm" className="absolute top-1/2 right-1 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-primary">
        <Search size={16} />
      </button>
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            variants={dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] min-w-full overflow-hidden rounded-xl border border-line bg-white text-left shadow-card-hover"
          >
            <SearchSuggestions
              listId={listId}
              optionId={optionId}
              items={items}
              activeIndex={activeIndex}
              status={status}
              error={error?.message}
              keyword={trimmed}
              onSelect={selectCourse}
              onHover={setActiveIndex}
              onShowAll={showAll}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
