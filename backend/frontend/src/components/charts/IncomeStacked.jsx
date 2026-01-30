import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function IncomeStacked({ data }) {
  const buckets = {
    "<5k": 0,
    "5k-10k": 0,
    ">10k": 0
  };

  data.forEach(d => {
    if (d.MonthlyIncome < 5000) buckets["<5k"]++;
    else if (d.MonthlyIncome <= 10000) buckets["5k-10k"]++;
    else buckets[">10k"]++;
  });

  const chartData = Object.keys(buckets).map(k => ({
    range: k,
    count: buckets[k]
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">
        Income Distribution
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#F97316"
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
