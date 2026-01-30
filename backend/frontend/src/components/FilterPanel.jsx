export default function FilterPanel({ filters, setFilters, data }) {
  const departments = [...new Set(data.map(d => d.Department))];

  const selectClass = `
    w-full px-4 py-2 rounded-lg
    bg-white text-gray-900
    dark:bg-slate-800 dark:text-white
    border border-gray-300 dark:border-slate-600
    focus:outline-none focus:ring-2 focus:ring-indigo-500
  `;

  const optionClass = `
    bg-white text-black
    dark:bg-slate-800 dark:text-white
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      
      {/* Department */}
      <select
        className={selectClass}
        value={filters.department}
        onChange={e => setFilters({ ...filters, department: e.target.value })}
      >
        <option value="All" className={optionClass}>All Departments</option>
        {departments.map(dep => (
          <option key={dep} value={dep} className={optionClass}>
            {dep}
          </option>
        ))}
      </select>

      {/* Job Satisfaction */}
      <select
        className={selectClass}
        value={filters.satisfaction}
        onChange={e => setFilters({ ...filters, satisfaction: e.target.value })}
      >
        <option value="All" className={optionClass}>All Satisfaction</option>
        <option value="1" className={optionClass}>Low</option>
        <option value="2" className={optionClass}>Medium-Low</option>
        <option value="3" className={optionClass}>Medium-High</option>
        <option value="4" className={optionClass}>High</option>
      </select>

      {/* Actual Attrition */}
      <select
        className={selectClass}
        value={filters.attrition}
        onChange={e => setFilters({ ...filters, attrition: e.target.value })}
      >
        <option value="All" className={optionClass}>All Attrition</option>
        <option value="Yes" className={optionClass}>Left</option>
        <option value="No" className={optionClass}>Working</option>
      </select>

      {/* Predicted Attrition */}
      <select
        className={selectClass}
        value={filters.predicted}
        onChange={e => setFilters({ ...filters, predicted: e.target.value })}
      >
        <option value="All" className={optionClass}>All Predictions</option>
        <option value="Yes" className={optionClass}>Likely to Leave</option>
        <option value="No" className={optionClass}>Likely to Stay</option>
      </select>
    </div>
  );
}
