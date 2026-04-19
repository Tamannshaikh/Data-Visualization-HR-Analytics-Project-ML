import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "All",
    location: "All"
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === "All" || job.role === filters.role;
    const matchesLocation = filters.location === "All" || job.jobType === filters.location;
    return matchesSearch && matchesRole && matchesLocation;
  });

  if (loading) return <div className="text-center py-20 dark:text-white">Loading Jobs...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Explore Open Positions</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join our mission to transform the future of HR. Find a role that matches your skills and passion.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
        <input 
          type="text" 
          placeholder="Search for job titles or roles..." 
          className="flex-grow p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="p-3 bg-gray-50 dark:bg-gray-700 dark:text-white border-none rounded-xl focus:ring-2 focus:ring-blue-500"
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        >
          <option value="All">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="Onsite">Onsite</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        {/* Role filter could be dynamic but keeping it simple for now */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group">
            <div className="mb-4 flex justify-between items-start">
               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-tighter">
                 {job.jobType}
               </span>
               <span className="text-xs text-gray-400 font-medium">Last Date: {new Date(job.lastDateToApply).toLocaleDateString()}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">{job.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{job.jobDescription}</p>
            
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-6">
               <div className="flex items-center gap-1"><span>📍</span> {job.locationPreference || "Any"}</div>
               <div className="flex items-center gap-1"><span>💰</span> {job.salaryRange || "Competitive"}</div>
            </div>

            <Link 
              to={`/jobs/${job._id}`}
              className="block w-full text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg"
            >
              Learn More & Apply
            </Link>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400">
             No jobs found matching your criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}
