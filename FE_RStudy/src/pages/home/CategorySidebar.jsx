import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function CategorySidebar({ categories }) {
  return (
    <nav className="rounded-xl bg-white p-4 shadow-sm" aria-label="Danh mục khóa học">
      <h2 className="mb-3 font-bold text-slate-800">Danh mục khóa học</h2>
      {categories.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có danh mục</p>
      ) : (
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`${ROUTES.COURSES}?categoryId=${category.id}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors duration-150 hover:bg-soft hover:text-primary"
              >
                <span className="truncate">{category.categoryName}</span>
                <span className="text-xs text-slate-400">{category.courseCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}