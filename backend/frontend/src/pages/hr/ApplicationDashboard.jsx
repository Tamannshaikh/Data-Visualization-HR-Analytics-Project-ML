import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ApplicationDashboard() {
  const { id } = useParams(); // Job ID
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);

  const fetchApplications = () => {
    const token = localStorage.getItem('token');
    fetch(`/api/applications/job/${id}`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setApplications(data));
  };

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));

    fetchApplications(); // eslint-disable-line react-hooks/exhaustive-deps
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (appId, newStatus) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/applications/${appId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ status: newStatus })
    });
    fetchApplications();
  };

  const deleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return;
    
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/applications/${appId}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    
    if (res.ok) {
      fetchApplications();
    } else {
      alert("Failed to delete application");
    }
  };

  if (!job) return <div className="text-gray-900 dark:text-white text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 text-gray-900 dark:text-white min-h-screen">
      <Link to="/hr/jobs" className="text-gray-400 mb-6 inline-block">&larr; Back to Jobs</Link>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{job.title} - Applications</h1>
        <p className="text-gray-400 mt-2">Total Applicants: {applications.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map(app => (
          <div key={app._id} className="bg-white dark:bg-gray-800 backdrop-blur-md rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-lg relative group transition-colors">
            <button 
              onClick={() => deleteApplication(app._id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-full text-red-500"
              title="Delete Application"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-white/20 rounded text-gray-300">
                {app.status}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold mb-1">{app.candidateName}</h2>
            <p className="text-sm text-gray-400 mb-4">{app.candidateEmail}</p>

            <div className={`mb-4 inline-block px-3 py-1 rounded-full text-sm font-bold ${app.aiScore > 75 ? 'bg-green-500/20 text-green-300 border border-green-500' : app.aiScore > 50 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500' : 'bg-red-500/20 text-red-300 border border-red-500'}`}>
              AI Match Score: {app.aiScore}%
            </div>

            <div className="mb-4">
              <h3 className="text-xs text-gray-400 mb-1">Matched Skills:</h3>
              <div className="flex flex-wrap gap-1">
                {app.aiMatchedSkills.length > 0 ? app.aiMatchedSkills.map(skill => (
                   <span key={skill} className="bg-green-600/30 text-xs px-2 py-1 rounded">{skill}</span>
                )) : <span className="text-xs text-gray-500">None detected</span>}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs text-gray-400 mb-1">Missing Skills:</h3>
              <div className="flex flex-wrap gap-1">
                {app.aiMissingSkills.length > 0 ? app.aiMissingSkills.map(skill => (
                   <span key={skill} className="bg-red-600/30 text-xs px-2 py-1 rounded">{skill}</span>
                )) : <span className="text-xs text-gray-500">None</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-center w-full bg-blue-600 hover:bg-blue-500 py-2 rounded text-sm font-bold">
                 View Resume PDF
               </a>
               
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400 ml-1">Update Status:</label>
                  <select 
                    value={app.status} 
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded text-xs font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Second Round">Second Round</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mt-10 shadow-sm transition-colors">
           <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">No applications received yet.</h3>
        </div>
      )}
    </div>
  );
}
