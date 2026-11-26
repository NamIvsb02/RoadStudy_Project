export default function CourseSelect({ courses, value, onChange }) {
  const all = value === "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={all}
        onClick={() => onChange("")}
        className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${all ? "bg-primary text-white" : "bg-white text-ink hover:bg-surface"}`}
      >
        Tất cả
      </button>
      <select
        aria-label="Chọn khóa học"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 min-w-64 max-w-md rounded-lg border border-line bg-white px-3 text-sm text-ink"
      >
        <option value="" disabled>
          Chọn một khóa học
        </option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.courseName}
          </option>
        ))}
      </select>
    </div>
  );
}
