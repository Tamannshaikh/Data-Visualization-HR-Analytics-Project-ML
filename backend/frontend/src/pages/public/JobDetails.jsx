import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => setJob(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!job) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 text-white">
      <Link to="/" className="text-gray-400 hover:text-white mb-6 inline-block">&larr; Back to Jobs</Link>
      
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h1 className="text-4xl font-extrabold mb-2">{job.title}</h1>
        <p className="text-xl text-blue-400 mb-6">{job.role}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Experience</h3>
            <p className="font-bold">{job.experienceRequired}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Salary</h3>
            <p className="font-bold">{job.salaryRange || 'Not disclosed'}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Job Type</h3>
            <p className="font-bold">{job.jobType}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400">Location</h3>
            <p className="font-bold">{job.locationPreference}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3 border-b border-white/20 pb-2">Description</h2>
          <p className="whitespace-pre-line text-gray-200">{job.jobDescription}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-3 border-b border-white/20 pb-2">Skills Required</h2>
          <div className="flex flex-wrap gap-2">
            {job.skillsRequired?.map((skill, index) => (
              <span key={index} className="bg-blue-600/30 border border-blue-500/50 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Link to={`/jobs/${job._id}/apply`} className="bg-green-600 px-8 py-3 rounded-full font-extrabold text-lg hover:bg-green-500 transition shadow-lg shadow-green-500/30">
            Apply for this Position
          </Link>
        </div>
      </div>
    </div>
  );
}
