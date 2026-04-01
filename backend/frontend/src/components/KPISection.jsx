import { useEffect, useState } from "react";
import {
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiTrendingUp,
  HiArrowUp,
  HiArrowDown
} from "react-icons/hi";

function CountUp({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

export default function KPISection({ data, setFilters }) {
  const total = data.length;
  const working = data.filter(d => d.Attrition === "No").length;
  const left = data.filter(d => d.Attrition === "Yes").length;
  const predicted = data.filter(d => d.Attrition_Predicted === "Yes").length;

  const trends = {
    working: +4,
    left: -2,
    predicted: +6
  };

  const cards = [
    {
      title: "Total Employees",
      value: total,
      icon: <HiUsers />,
      glow: "from-indigo-500 to-blue-500",
      action: () => setFilters(f => ({ ...f, attrition: "All" }))
    },
    {
      title: "Currently Working",
      value: working,
      icon: <HiCheckCircle />,
      glow: "from-green-500 to-emerald-500",
      trend: trends.working,
      action: () => setFilters(f => ({ ...f, attrition: "No" }))
    },
    {
      title: "Already Left",
      value: left,
      icon: <HiXCircle />,
      glow: "from-red-500 to-pink-500",
      trend: trends.left,
      action: () => setFilters(f => ({ ...f, attrition: "Yes" }))
    },
    {
      title: "Predicted Leavers",
      value: predicted,
      icon: <HiTrendingUp />,
      glow: "from-orange-500 to-yellow-500",
      trend: trends.predicted,
      action: () => setFilters(f => ({ ...f, predicted: "Yes" }))
    }
  ];

  const insight =
    predicted > left
      ? "⚠️ Attrition risk is rising. Preventive HR action recommended."
      : "✅ Attrition is under control. Workforce stability looks healthy.";

  return (
    <>
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={card.action}
            className="relative cursor-pointer rounded-xl p-[1px] bg-gradient-to-r
                       hover:scale-[1.015] hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute inset-0 rounded-xl blur-sm opacity-25 bg-gradient-to-r ${card.glow}`}></div>

            <div className="relative bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-0.5">
                    <CountUp value={card.value} />
                  </h2>

                  {card.trend !== undefined && (
                    <p className={`text-sm flex items-center gap-1 mt-1 
                      ${card.trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {card.trend >= 0 ? <HiArrowUp /> : <HiArrowDown />}
                      {Math.abs(card.trend)}% vs last month
                    </p>
                  )}
                </div>

                <div
                  className={`text-2xl p-2 rounded-full text-white bg-gradient-to-r ${card.glow} opacity-90`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI INSIGHT */}
      <div className="mt-6 bg-indigo-50 dark:bg-slate-800 border-l-4 
        border-indigo-500 p-4 rounded-lg">
        <p className="text-indigo-900 dark:text-indigo-300 font-medium">
          {insight}
        </p>
      </div>
    </>
  );
}
