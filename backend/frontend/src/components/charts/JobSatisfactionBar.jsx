import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function JobSatisfactionBar({ data }) {
  const levels = [1, 2, 3, 4];

  const chartData = levels.map(lvl => ({
    level: `Level ${lvl}`,
    count: data.filter(d => d.JobSatisfaction === lvl).length
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">
        Job Satisfaction
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#22C55E"
            radius={[6, 6, 0, 0]}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
