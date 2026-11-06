const chipClass = (active) =>
  `rounded-full px-4 py-1.5 text-sm transition-colors duration-150 ${
    active ? 'bg-primary text-white' : 'bg-soft text-slate-700 hover:bg-slate-200'
  }`;

export default function CategoryChips({ categories, activeId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onSelect('')} className={chipClass(!activeId)}>
        Tất cả
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={chipClass(activeId === category.id)}
        >
          {category.categoryName} ({category.courseCount})
        </button>
      ))}
    </div>
  );
}