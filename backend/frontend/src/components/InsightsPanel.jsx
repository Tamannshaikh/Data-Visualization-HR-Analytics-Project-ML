export default function InsightsPanel({ data, theme }) {
  const card = theme === "dark" ? "card card-dark" : "card card-light";

  return (
    <div className={card}>
      <h2 className="text-lg font-bold mb-2">Key Insights</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Employees with low job satisfaction show higher attrition.</li>
        <li>Research & Development has the highest workforce.</li>
        <li>Lower income employees are more likely to leave.</li>
        <li>Prediction mismatch indicates ML improvement scope.</li>
      </ul>
    </div>
  );
}
