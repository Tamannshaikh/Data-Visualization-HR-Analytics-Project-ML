export default function Header({ darkMode, setDarkMode }) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
      <h1 className="text-xl font-bold">
        HR Analytics & Attrition Dashboard
      </h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-white text-black px-4 py-2 rounded"
      >
        {darkMode ? "Light 🌞" : "Dark 🌙"}
      </button>
    </div>
  );
}
