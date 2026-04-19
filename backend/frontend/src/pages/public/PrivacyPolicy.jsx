import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="mb-4">
        At CorpHR, we value your privacy. This Privacy Policy outlines how we collect, use, 
        and protect your personal information when you use our recruitment platform.
      </p>
      
      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, contact details, 
            and resume data when you apply for jobs or use our HR services.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6">
            <li>To process and evaluate your job applications.</li>
            <li>To manage employee records and HR processes.</li>
            <li>To communicate with you regarding your application status.</li>
            <li>To improve our services and user experience.</li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
          <p>
            We implement advanced security measures to protect your data from unauthorized access, 
            disclosure, or modification. Your data is stored securely on our cloud-based infrastructure.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. 
            If you wish to do so, please contact our HR department.
          </p>
        </div>
      </section>
      
      <div className="mt-12 pt-6 border-t border-gray-300 dark:border-gray-700 text-sm italic">
        Last updated: April 6, 2026
      </div>
    </div>
  );
}
