import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Contexts & Auth
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Bubbles from "./components/Bubbles";

// Public Pages
import CareerHome from "./pages/public/CareerHome";
import Login from "./pages/public/Login";
import JobDetails from "./pages/public/JobDetails";
import Jobs from "./pages/public/Jobs";
import AboutUs from "./pages/public/AboutUs";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsOfService from "./pages/public/TermsOfService";

// Candidate Pages
import ApplyForm from "./pages/candidate/ApplyForm";

// HR Pages
import CreateJob from "./pages/hr/CreateJob";
import JobList from "./pages/hr/JobList";
import ApplicationDashboard from "./pages/hr/ApplicationDashboard";
import EmployeeManagement from "./pages/hr/EmployeeManagement";
import RecruitmentDashboard from "./pages/hr/RecruitmentDashboard";
import OfferLetterGenerator from "./pages/hr/OfferLetterGenerator";

// Legacy HR Analytics Dashboard (Optional)
import Dashboard from "./Dashboard";

function Layout({ children, darkMode, setDarkMode }) {
  return (
    <div
      className={`min-h-screen flex flex-col transition-all relative overflow-x-hidden ${
        darkMode ? "dark bg-slate-900" : "bg-gray-100"
      }`}
    >
      {/* ── Animated liquid background blobs ── */}
      <div className="liquid-bg" aria-hidden="true">
        <div className={`blob blob-1 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-2 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-3 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-4 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <div className={`blob blob-5 ${darkMode ? "dark-blob" : "light-blob"}`}></div>
        <Bubbles darkMode={darkMode} />
      </div>

      {/* ── Sticky Navbar ── */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ── Main Page Content ── */}
      <main className="relative flex-grow p-4 md:p-6">
        {children}
      </main>

      {/* ── Footer ── */}
      <Footer darkMode={darkMode} />
    </div>
  );
}

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
    <AuthProvider>
      <Router>
        <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<CareerHome />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/apply" element={<ApplyForm />} />

            {/* ── HR Protected Routes ── */}
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <RecruitmentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/analytics"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <JobList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs/create"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/jobs/:id/applications"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <ApplicationDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/employees"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <EmployeeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/onboard"
              element={
                <ProtectedRoute allowedRoles={["HR"]}>
                  <OfferLetterGenerator />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
