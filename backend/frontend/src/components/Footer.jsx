import React from 'react';
import { Link } from 'react-router-dom';

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

export default function Footer({ darkMode }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900/50 backdrop-blur-xl transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-black text-sm">CH</span>
              </div>
              <span className="text-gray-900 dark:text-white font-extrabold text-2xl tracking-tight">
                Corp<span className="text-blue-500">HR</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Pioneering the future of recruitment with AI-driven talent acquisition and predictive workforce analytics. 
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">Solution</h3>
            <ul className="space-y-3">
              {[
                { label: 'Browse Jobs', to: '/jobs' },
                { label: 'About Us', to: '/about' },
                { label: 'HR Dashboard', to: '/hr/dashboard' },
                { label: 'Employee Hub', to: '/hr/employees' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">Support</h3>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Documentation', to: '#' },
                { label: 'Help Center', to: '#' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-6">
            <h3 className="text-gray-900 dark:text-white font-bold text-lg">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 text-blue-500 shrink-0"><LocationIcon /></div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                   Techno Park, Bandra East,<br/>Mumbai, MH 400051
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-blue-500 shrink-0"><PhoneIcon /></div>
                <div className="text-sm text-gray-600 dark:text-gray-400">+91 22 1234 5678</div>
              </li>
              <li className="flex items-center gap-3">
                <div className="text-blue-500 shrink-0"><EmailIcon /></div>
                <div className="text-sm text-gray-600 dark:text-gray-400">hr@corphr.com</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} <span className="text-gray-900 dark:text-gray-200 font-black tracking-tight">CorpHR Inc.</span> All rights reserved.
            </p>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] font-black">
              Pioneering Data-Driven Recruitment
            </span>
          </div>

          <div className="flex items-center gap-4">
             {/* Social Links */}
             {[
               { name: 'LinkedIn', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', to: '#' },
               { name: 'Twitter', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', to: '#' },
               { name: 'GitHub', icon: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12', to: '#' }
             ].map(social => (
               <a 
                 key={social.name} 
                 href={social.to} 
                 className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/20 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 transition-all group shadow-sm border border-transparent dark:border-white/10"
                 title={social.name}
               >
                 <svg className={`w-5 h-5 ${darkMode ? 'fill-white' : 'fill-gray-600'} group-hover:fill-white transition-colors`} viewBox="0 0 24 24">
                   <path d={social.icon} />
                 </svg>
               </a>
             ))}
          </div>

          <div className="flex items-center gap-6">
             <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black">AI Orchestrated Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
