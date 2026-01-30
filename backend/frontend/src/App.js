import { useEffect, useState } from "react";
import Dashboard from "./Dashboard";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-all">
      <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}
