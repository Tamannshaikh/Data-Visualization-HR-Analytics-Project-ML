import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function AttritionBar({ data }) {
  const staying = data.filter(d => d.Attrition === "No").length;
  const leaving = data.filter(d => d.Attrition === "Yes").length;

  const chartData = [
    { name: "Staying", value: staying },
    { name: "Leaving", value: leaving }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">
        Actual Attrition
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#6366F1"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
