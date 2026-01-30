import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F97316"];

export default function DepartmentPie({ data }) {
  const deptMap = {};

  data.forEach(d => {
    deptMap[d.Department] = (deptMap[d.Department] || 0) + 1;
  });

  const chartData = Object.keys(deptMap).map(key => ({
    name: key,
    value: deptMap[key]
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">
        Department-wise Attrition
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={4}
            animationDuration={900}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
