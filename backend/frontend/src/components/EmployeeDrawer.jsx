import ConfidenceMeter from "./ConfidenceMeter";

export default function EmployeeDrawer({ employee, onClose }) {

  const getRecommendation = () => {
    if (employee.Attrition_Predicted !== "Yes") {
      return "No immediate HR action required. Employee is stable.";
    }

    if (employee.JobSatisfaction <= 2) {
      return "Schedule a 1-on-1 meeting to understand job dissatisfaction.";
    }

    if (employee.MonthlyIncome < 5000) {
      return "Consider salary revision or performance-based incentives.";
    }

    if (employee.Age < 30) {
      return "Discuss career growth opportunities and learning paths.";
    }

    if (employee.Department === "Sales") {
      return "Review workload, targets, and incentive structure.";
    }

    return "Monitor employee closely and provide engagement support.";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="w-full sm:w-96 bg-white dark:bg-slate-900 p-6 shadow-xl">

        <button
          onClick={onClose}
          className="text-right w-full text-gray-500 hover:text-red-500"
        >
          ✖ Close
        </button>

        <h2 className="text-xl font-bold mt-2 dark:text-white">
          Employee Details
        </h2>

        <div className="mt-4 space-y-2 text-sm dark:text-gray-200">
          <p><b>Age:</b> {employee.Age}</p>
          <p><b>Department:</b> {employee.Department}</p>
          <p><b>Job Satisfaction:</b> {employee.JobSatisfaction}/4</p>
          <p><b>Monthly Income:</b> ₹{employee.MonthlyIncome}</p>

          <p>
            <b>Attrition:</b>{" "}
            <span className={employee.Attrition === "Yes" ? "text-red-500" : "text-green-500"}>
              {employee.Attrition}
            </span>
          </p>

          <p>
            <b>Predicted:</b>{" "}
            <span className={employee.Attrition_Predicted === "Yes" ? "text-orange-500" : "text-blue-500"}>
              {employee.Attrition_Predicted}
            </span>
          </p>

          {/* 🔥 ML Confidence Meter */}
          <ConfidenceMeter value={employee.confidence} />
        </div>

        {/* 🔹 HR Recommendation */}
        <div className="mt-6 p-4 rounded-lg border-l-4
          border-indigo-500 bg-indigo-50 dark:bg-slate-800">
          
          <h3 className="font-semibold text-indigo-700 dark:text-indigo-300">
            HR Recommendation
          </h3>

          <p className="mt-2 text-sm text-indigo-900 dark:text-indigo-200">
            {getRecommendation()}
          </p>
        </div>

      </div>
    </div>
  );
}
