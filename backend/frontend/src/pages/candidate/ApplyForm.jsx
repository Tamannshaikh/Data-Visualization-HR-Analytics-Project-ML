import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ApplyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ candidateName: '', candidateEmail: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload your resume.");
    setLoading(true);
    
    const data = new FormData();
    data.append('candidateName', formData.candidateName);
    data.append('candidateEmail', formData.candidateEmail);
    data.append('resume', file);

    try {
      const res = await axios.post(`/api/applications/${id}/apply`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      
      if (res.status === 201) {
        alert("🎉 Application submitted successfully! Our HR team will review it shortly.");
        navigate('/jobs');
      }
    } catch (err) {
      setLoading(false);
      console.error("Apply error:", err);
      alert(err.response?.data?.message || "Error submitting application. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="text-center mb-10">
           <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Apply for Position</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium">Please provide your details and upload your latest resume.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="John Doe"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={formData.candidateName}
              onChange={e => setFormData({ ...formData, candidateName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="john@example.com"
              className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              value={formData.candidateEmail}
              onChange={e => setFormData({ ...formData, candidateEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Resume (PDF Only)</label>
            <div className="relative group">
               <input 
                required
                type="file" 
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={e => setFile(e.target.files[0])}
               />
               <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center group-hover:border-blue-500 transition-all bg-gray-50/50 dark:bg-gray-900/50">
                  <div className="text-3xl mb-2">{file ? '📄' : '📤'}</div>
                  <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                    {file ? file.name : 'Click or drop your resume here'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</div>
               </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Application...
              </>
            ) : (
              <>Submit Application <span className="text-lg">✨</span></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
