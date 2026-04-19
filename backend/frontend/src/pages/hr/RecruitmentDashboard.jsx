import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RecruitmentDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    selected: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { 'x-auth-token': token };

        const [jobsRes, appsRes, statusRes] = await Promise.all([
          axios.get("/api/jobs/all", { headers }),
          axios.get("/api/applications", { headers }),
          axios.get("/api/status"),
        ]);

        const jobs = jobsRes.data;
        const apps = appsRes.data;

        setStats({
          totalJobs: jobs.length,
          totalApplicants: apps.length,
          selected: apps.filter(a => a.status === "Selected").length,
          pending: apps.filter(a => a.status === "Applied" || a.status === "Shortlisted").length,
        });
        setDbConnected(statusRes.data.dbConnected);
        setError(null);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to fetch dashboard data. Please ensure you are logged in as HR.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <h3 className="font-bold">Error</h3>
      <p>{error}</p>
    </div>
  );

  const kpiCards = [
    { title: "Total Jobs", value: stats.totalJobs, color: "blue", link: "/hr/jobs" },
    { title: "Total Applicants", value: stats.totalApplicants, color: "purple", link: "/hr/jobs" },
    { title: "Selected Candidates", value: stats.selected, color: "green", link: "#" },
    { title: "Pending Reviews", value: stats.pending, color: "yellow", link: "#" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruitment Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time statistics for your hiring process.</p>
        </div>
        <Link 
          to="/hr/jobs/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          + Post New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <div key={card.title} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.title}</h3>
            <p className={`text-4xl font-extrabold mt-2 text-${card.color}-500`}>{card.value}</p>
            <div className="mt-4 flex items-center justify-between">
               <span className="text-xs text-gray-400">Updated just now</span>
               {card.link !== "#" && (
                 <Link to={card.link} className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                   View Details <span>→</span>
                 </Link>
               )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
               <Link to="/hr/employees" className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold dark:text-white">Manage Employees</div>
               </Link>
               <Link to="/hr/jobs" className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-semibold dark:text-white">Active Jobs</div>
               </Link>
            </div>
         </div>
         
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Database Status</h2>
            {dbConnected ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="font-medium">Live Database Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <span className="font-medium">Standalone Demo Mode</span>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {dbConnected 
                ? "Your system is currently synced with the live MongoDB database." 
                : "Note: The live database is currently offline (IP whitelist/config). You are viewing mock data from hr_dashboard_data.json."
              }
            </p>
          </div>
      </div>
    </div>
  );
}
