import { useEffect, useState } from "react";
import axios from "axios";

import Header from "./components/Header";
import FilterPanel from "./components/FilterPanel";
import KPISection from "./components/KPISection";
import AttritionBar from "./components/charts/AttritionBar";
import JobSatisfactionBar from "./components/charts/JobSatisfactionBar";
import DepartmentPie from "./components/charts/DepartmentPie";
import IncomeStacked from "./components/charts/IncomeStacked";
import InsightsPanel from "./components/InsightsPanel";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeDrawer from "./components/EmployeeDrawer";

export default function Dashboard({ darkMode, setDarkMode }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [filters, setFilters] = useState({
    department: "All",
    satisfaction: "All",
    attrition: "All",
    predicted: "All"
  });

  useEffect(() => {
    axios.get("/api/employees/risk-data")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredData = employees.filter(emp => (
    (filters.department === "All" || emp.Department === filters.department) &&
    (filters.satisfaction === "All" || emp.JobSatisfaction === Number(filters.satisfaction)) &&
    (filters.attrition === "All" || emp.Attrition === filters.attrition) &&
    (filters.predicted === "All" || emp.Attrition_Predicted === filters.predicted)
  ));

  return (
    <div className="p-6 space-y-6">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <FilterPanel filters={filters} setFilters={setFilters} data={employees} />

      <KPISection data={filteredData} setFilters={setFilters} />

      <InsightsPanel data={filteredData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttritionBar data={filteredData} />
        <JobSatisfactionBar data={filteredData} />
        <DepartmentPie data={filteredData} />
        <IncomeStacked data={filteredData} />
      </div>

      {/* 🔽 DRILL DOWN TABLE */}
      <EmployeeTable
        data={filteredData}
        onSelect={setSelectedEmployee}
      />

      {/* 🔽 SIDE DRAWER */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}
