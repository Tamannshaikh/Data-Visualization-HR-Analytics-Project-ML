export default function ConfidenceMeter({ value }) {

  const getColor = () => {
    if (value >= 80) return "bg-red-500";
    if (value >= 60) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 dark:text-gray-300">
        ML Confidence: {value}%
      </p>

      <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded">
        <div
          className={`h-2 rounded ${getColor()}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
