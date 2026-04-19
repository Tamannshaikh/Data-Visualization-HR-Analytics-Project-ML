import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  const fetchJobs = () => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      fetchJobs();
    } catch(err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/jobs/${editingJob}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        setEditingJob(null);
        fetchJobs();
      } else {
        const errData = await res.json();
        alert("Error updating job: " + (errData.message || "Unknown error"));
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Manage Careers</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Create, update, and manage your organization's job openings.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-4 py-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/20 dark:text-white outline-none transition-all shadow-sm font-semibold"
            />
          </div>
          <Link to="/hr/jobs/create" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 rounded-2xl text-white font-black transition-all shadow-xl shadow-blue-500/25 active:scale-95 whitespace-nowrap">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            Post New Opening
          </Link>
        </div>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700 dark:text-slate-100 border-collapse">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="p-5 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400">Position</th>
                <th className="p-5 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400">Category</th>
                <th className="p-5 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400">Setup</th>
                <th className="p-5 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400 text-center">Openings</th>
                <th className="p-5 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400">Deadline</th>
                <th className="p-5 font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {jobs
                .filter(job => 
                  job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  job.role?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  job.jobType?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(job => (
                <tr key={job._id || job.id} className="group hover:bg-blue-500/[0.02] dark:hover:bg-blue-400/[0.02] transition-colors">
                  <td className="p-5">
                    <div className="font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</div>
                    <div className="text-xs text-gray-500 font-medium">ID: {job._id || job.id}</div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">{job.role}</span>
                  </td>
                  <td className="p-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[11px]">{job.jobType}</td>
                  <td className="p-5 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white font-black text-sm">{job.numberOfOpenings}</div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {job.lastDateToApply ? new Date(job.lastDateToApply).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Limit'}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => {setEditingJob(job._id || job.id); setEditFormData(job);}} 
                        className="p-2.5 bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                        title="Edit Job"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(job._id || job.id)} 
                        className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                        title="Delete Job"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                      <Link 
                        to={`/hr/jobs/${job._id || job.id}/applications`} 
                        className="ml-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[11px] font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg active:scale-95"
                      >
                        Applicants
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan="6" className="p-20 text-center text-gray-500 dark:text-gray-400 font-bold text-lg italic opacity-50">No active job listings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingJob && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] flex flex-col border border-white/20">
             <div className="p-8 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
               <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    MODIFY POSITION
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 ml-5">Editing: <span className="text-blue-500">{editFormData.title}</span></p>
               </div>
               <button onClick={() => setEditingJob(null)} className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-500/50 transition-all shadow-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
             </div>
             
             <form onSubmit={handleEditSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Job Title */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      Job Title
                    </div>
                    <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" required />
                  </div>

                  {/* Department */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                      Department
                    </div>
                    <input type="text" value={editFormData.role} onChange={(e) => setEditFormData({...editFormData, role: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" required />
                  </div>

                  {/* Experience Level */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.825-3.003 12.083 12.083 0 01.665-6.479L12 14z" /></svg>
                      Experience Required
                    </div>
                    <select 
                      value={editFormData.experienceRequired} 
                      onChange={(e) => setEditFormData({...editFormData, experienceRequired: e.target.value})} 
                      className="w-full p-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                      required
                    >
                      <option value="Internship" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Internship</option>
                      <option value="Entry Level (0-1 yrs)" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Entry Level (0-1 yrs)</option>
                      <option value="Junior (1-3 yrs)" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Junior (1-3 yrs)</option>
                      <option value="Mid-level (3-5 yrs)" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Mid-level (3-5 yrs)</option>
                      <option value="Senior (5-10 yrs)" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Senior (5-10 yrs)</option>
                      <option value="Lead/Principal (10+ yrs)" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Lead/Principal (10+ yrs)</option>
                    </select>
                  </div>

                  {/* Environment */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Work Environment
                    </div>
                    <select 
                      value={editFormData.jobType} 
                      onChange={(e) => setEditFormData({...editFormData, jobType: e.target.value})} 
                      className="w-full p-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25rem' }}
                    >
                      <option value="Onsite" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Onsite</option>
                      <option value="Remote" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Remote</option>
                      <option value="Hybrid" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">Hybrid</option>
                    </select>
                  </div>

                  {/* Headcount */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      Total Headcount
                    </div>
                    <input type="number" value={editFormData.numberOfOpenings} onChange={(e) => setEditFormData({...editFormData, numberOfOpenings: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" required />
                  </div>

                  {/* Salary */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Salary Budget Range
                    </div>
                    <input type="text" value={editFormData.salaryRange} onChange={(e) => setEditFormData({...editFormData, salaryRange: e.target.value})} className="w-full p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="e.g. 50k - 80k" />
                  </div>

                  {/* Deadline */}
                  <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      Application Deadline
                    </div>
                    <input type="date" value={editFormData.lastDateToApply ? editFormData.lastDateToApply.substring(0, 10) : ''} onChange={(e) => setEditFormData({...editFormData, lastDateToApply: e.target.value})} className="w-full p-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>

                {/* Description */}
                <div className="group space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 transition-colors group-focus-within:text-blue-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h7"/></svg>
                      Role Description & Requirements
                    </div>
                    <textarea rows="5" value={editFormData.jobDescription} onChange={(e) => setEditFormData({...editFormData, jobDescription: e.target.value})} className="w-full p-5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed" placeholder="Tell candidates about this amazing opportunity..." required></textarea>
                </div>

                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-500/[0.05] to-indigo-500/[0.05] rounded-[2rem] border border-blue-500/10">
                  <div className="relative">
                    <input type="checkbox" checked={editFormData.isActive} onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})} className="peer w-6 h-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-transparent text-blue-600 focus:ring-0 transition-all cursor-pointer" />
                    <svg className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <div>
                    <span className="block text-sm font-black text-gray-900 dark:text-white">Active Listing</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">This job will be visible to all candidates in the Career Home section.</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <button type="submit" className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-5 rounded-3xl transition-all shadow-2xl shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                    Commit Changes
                  </button>
                  <button type="button" onClick={() => setEditingJob(null)} className="flex-1 bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-black py-5 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">DISCARD</button>
                </div>
             </form>
           </div>
         </div>
      )}
    </div>

  );
}
