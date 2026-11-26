import { motion } from "framer-motion";
import { tabIndicator } from "../../constants/motion";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light ${
        active ? "text-white" : "border border-line bg-white text-ink hover:bg-primary-100"
      }`}
    >
      {active && <motion.span layoutId="resource-chip" transition={tabIndicator} className="absolute inset-0 rounded-full bg-primary" />}
      <span className="relative">{children}</span>
    </button>
  );
}

export default function ResourceCategoryChips({ categories, activeId, onSelect }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      <Chip active={!activeId} onClick={() => onSelect("")}>
        Tất cả
      </Chip>
      {categories.map((category) => (
        <Chip key={category.id} active={activeId === category.id} onClick={() => onSelect(category.id)}>
          {category.categoryName}
        </Chip>
      ))}
    </div>
  );
}
