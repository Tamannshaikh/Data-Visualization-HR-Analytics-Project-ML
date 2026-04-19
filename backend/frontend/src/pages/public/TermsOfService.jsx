import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="mb-4">
        By using the CorpHR recruitment platform, you agree to comply with the 
        following terms and conditions.
      </p>
      
      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Use of Services</h2>
          <p>
            Our services are intended for recruitment and HR management purposes only. 
            You must provide accurate and truthful information during the application process.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-3">2. User Conduct</h2>
          <p>
            Users are prohibited from uploading malicious content, scraping data, 
            or misrepresenting their qualifications. 
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-3">3. Liability</h2>
          <p>
            CorpHR is not responsible for any inaccuracies in job listings or candidate data provided 
            by users. We do not guarantee employment through our platform.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Account Security</h2>
          <p>
            HR admins are responsible for maintaining the confidentiality of their login credentials. 
            Any activity under your account is your responsibility.
          </p>
        </div>
      </section>
      
      <div className="mt-12 pt-6 border-t border-gray-300 dark:border-gray-700 text-sm italic">
        Last updated: April 6, 2026
      </div>
    </div>
  );
}
