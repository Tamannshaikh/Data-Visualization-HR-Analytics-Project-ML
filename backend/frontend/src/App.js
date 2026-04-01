import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Bubbles from "./components/Bubbles";


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
    <div className={`min-h-screen transition-all relative overflow-hidden ${darkMode ? "dark bg-slate-900" : "bg-gray-100"}`}>
      {/* ── Liquid / Gas background blobs ── */}
      <div className="liquid-bg" aria-hidden="true">
        <div className={`blob blob-1 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-2 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-3 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-4 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-5 ${darkMode ? "dark-blob" : "light-blob"}`}></div>

        {/* Floating bubbles */}
        <Bubbles darkMode={darkMode} />
      </div>

      {/* Dashboard sits above the background */}
      <div className="relative z-10">
        <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </div>
  );
}
