import React from 'react';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>
      <p className="text-lg mb-4">
        Welcome to CorpHR, your trusted partner in modern recruitment and employee management. 
        We specialize in connecting top talent with industry leaders using cutting-edge technology 
        and data-driven insights.
      </p>
      <p className="text-lg mb-4">
        Our mission is to streamline the hiring process, making it more efficient for HR teams 
        and more accessible for candidates. With our AI-powered screening and comprehensive 
        employee tracking, we ensure that every hire counts.
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-3">Our Core Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Transparency in Recruitment</li>
          <li>Innovation in HR Tech</li>
          <li>Employee Growth & Development</li>
          <li>Data Security & Privacy</li>
        </ul>
      </div>
    </div>
  );
}
