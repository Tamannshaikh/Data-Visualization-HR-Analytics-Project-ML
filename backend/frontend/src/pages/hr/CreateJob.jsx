import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "UI/UX Designer", "HR Manager", "HR Specialist", "Product Manager", 
  "Data Scientist", "Marketing Executive", "Sales Associate", "DevOps Engineer"
];

const EXPERIENCE_LEVELS = [
  "Internship", "Entry Level (0-1 yrs)", "Junior (1-3 yrs)", 
  "Mid-level (3-5 yrs)", "Senior (5-10 yrs)", "Lead/Principal (10+ yrs)"
];

export default function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    role: ROLES[0],
    experienceRequired: EXPERIENCE_LEVELS[0],
    skillsRequired: '',
    salaryRange: '',
    jobType: 'Onsite',
    workingDays: '',
    benefits: '',
    locationPreference: 'Any',
    numberOfOpenings: 1,
    lastDateToApply: '',
    jobDescription: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()).filter(s => s),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b)
      };

      const res = await axios.post('/api/jobs', payload, {
        headers: { 
          'x-auth-token': token
        }
      });
      
      if (res.status === 201) {
        alert("🎉 Job Created Successfully!");
        navigate('/hr/jobs');
      }
    } catch (err) {
      console.error("Create job error:", err);
      alert(err.response?.data?.message || "Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mt-16 blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Post New Opening</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Create a new job opportunity for candidates.</p>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Job Title</label>
              <input required name="title" placeholder="e.g. Senior Frontend Engineer" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Company Role</label>
              <select name="role" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Experience Level</label>
              <select name="experienceRequired" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                {EXPERIENCE_LEVELS.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Salary Budget</label>
              <input name="salaryRange" placeholder="e.g. $80k - $120k" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Job Setting</label>
              <select name="jobType" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                 <option value="Onsite">🏢 Onsite</option>
                 <option value="Remote">🏠 Remote</option>
                 <option value="Hybrid">🤝 Hybrid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Location Strategy</label>
              <select name="locationPreference" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                 <option value="Any">🌐 Anywhere</option>
                 <option value="Local">📍 Local Only</option>
                 <option value="Non-local">✈️ Non-local Welcome</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Deadline for Applications</label>
              <input required type="date" name="lastDateToApply" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Open Positions</label>
              <input required type="number" name="numberOfOpenings" value={formData.numberOfOpenings} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Core Skills (split with commas)</label>
            <input name="skillsRequired" placeholder="React, Tailwind, Node.js, AWS..." onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Perks & Benefits (split with commas)</label>
            <input name="benefits" placeholder="Health Insurance, Flexible Hours, Stock Options..." onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Job Description</label>
            <textarea required name="jobDescription" placeholder="Explain the role, expectations, and day-to-day responsibilities..." onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-40 resize-none"></textarea>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
            >
              {loading ? 'Publishing Opportunity...' : '🚀 Publish Job Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
