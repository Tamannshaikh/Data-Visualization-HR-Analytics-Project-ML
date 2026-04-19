import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CareerHome() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/jobs')
      .then(res => setJobs(res.data.slice(0, 3))) // Show only top 3 as featured
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* ── Hero Section ── */}
      <section className="relative py-20 px-4 flex flex-col items-center text-center space-y-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 blur-3xl pointer-events-none">
           <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full"></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
          Build the Future of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-600">HR Analytics</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Whether you're an engineer, designer, or data scientist, join our distributed team to build 
          the next generation of recruitment tools.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/jobs" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 hover:bg-blue-700 transition-all">
            Browse All Jobs
          </Link>
          <Link to="/about" className="px-8 py-4 bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-white/20 transition-all">
            Learn About CorpHR
          </Link>
        </div>
      </section>

      {/* ── Featured Jobs ── */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Opportunities</h2>
            <p className="text-gray-500 dark:text-gray-400">Handpicked roles just for you.</p>
          </div>
          <Link to="/jobs" className="text-blue-500 font-bold hover:underline mb-2 flex items-center gap-1">
             View all jobs <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 dark:text-gray-400">Loading opportunities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {jobs.map(job => (
              <div key={job._id} className="group bg-white dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer">
                <div className="mb-6 flex justify-between items-start">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-xl">💼</div>
                   <span className="text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full uppercase italic">
                     {job.jobType}
                   </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-500 transition-colors">
                  {job.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                  {job.jobDescription}
                </p>
                <Link to={`/jobs/${job._id}`} className="inline-flex items-center gap-2 text-blue-500 font-bold group-hover:gap-4 transition-all">
                   Apply Now <span>→</span>
                </Link>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500 italic">No featured jobs at the moment.</div>
            )}
          </div>
        )}
      </section>

      {/* ── Stats / CTA ── */}
      <section className="bg-gradient-to-br from-blue-600 to-violet-700 mx-4 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/40">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
         <h2 className="text-4xl md:text-5xl font-black mb-6">Revolutionizing the HR Experience.</h2>
         <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
           Our platform uses cutting-edge data visualization and AI to help companies hire better, 
           retain talent, and build healthier organizational cultures. Join the movement.
         </p>
         <button className="px-10 py-5 bg-white text-blue-600 font-extrabold rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
           Get Started Today
         </button>
      </section>
    </div>
  );
}
