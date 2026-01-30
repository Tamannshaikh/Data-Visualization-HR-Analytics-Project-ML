import { useState } from "react";

export default function EmployeeTable({ data, onSelect }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 10;

  // 🔍 SEARCH FILTER
  const searchedData = data.filter(emp =>
    emp.Department.toLowerCase().includes(search.toLowerCase()) ||
    emp.Attrition.toLowerCase().includes(search.toLowerCase()) ||
    emp.Attrition_Predicted.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(searchedData.length / perPage);
  const start = (page - 1) * perPage;
  const currentData = searchedData.slice(start, start + perPage);

  // 🔢 PAGINATION < 1 2 3 >
  const getPageNumbers = () => {
    if (page === 1) return [1, 2, 3].filter(p => p <= totalPages);
    if (page === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages].filter(p => p > 0);
    return [page - 1, page, page + 1];
  };

  // 📥 EXPORT CSV
  const exportCSV = () => {
    const headers = [
      "Age",
      "Department",
      "MonthlyIncome",
      "JobSatisfaction",
      "Attrition",
      "Attrition_Predicted"
    ];

    const rows = searchedData.map(emp => [
      emp.Age,
      emp.Department,
      emp.MonthlyIncome,
      emp.JobSatisfaction,
      emp.Attrition,
      emp.Attrition_Predicted
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach(r => {
      csv += r.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "hr_attrition_export.csv";
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">

      {/* 🔍 SEARCH + EXPORT */}
      <div className="flex gap-3 w-full max-w-5xl justify-between">
        <input
          type="text"
          placeholder="Search Department / Attrition / Prediction"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md px-4 py-2 rounded-lg
            bg-white dark:bg-slate-800
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-slate-600
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-xl shadow p-4 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3 text-center dark:text-white">
          Employee Drill-down
        </h3>

        <table className="w-full text-sm text-center">
          <thead className="text-gray-500 dark:text-gray-400 border-b">
            <tr>
              <th className="py-2">Age</th>
              <th>Department</th>
              <th>Income</th>
              <th>Attrition</th>
              <th>Prediction</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map(emp => {
              const highRisk = emp.Attrition_Predicted === "Yes";

              return (
                <tr
                  key={emp._id}
                  onClick={() => onSelect(emp)}
                  className={`
                    cursor-pointer transition
                    ${highRisk
                      ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
                      : "hover:bg-indigo-50 dark:hover:bg-slate-700"}
                  `}
                >
                  <td className="py-2">{emp.Age}</td>
                  <td>{emp.Department}</td>
                  <td>₹{emp.MonthlyIncome}</td>
                  <td className={emp.Attrition === "Yes" ? "text-red-500" : "text-green-500"}>
                    {emp.Attrition}
                  </td>
                  <td className="flex justify-center items-center gap-2">
                    <span className={emp.Attrition_Predicted === "Yes" ? "text-orange-500" : "text-blue-500"}>
                      {emp.Attrition_Predicted}
                    </span>
                    {highRisk && (
                      <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full">
                        High Risk
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 disabled:opacity-40"
        >
          &lt;
        </button>

        {getPageNumbers().map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded
              ${page === p
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-slate-700"}
            `}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 disabled:opacity-40"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
