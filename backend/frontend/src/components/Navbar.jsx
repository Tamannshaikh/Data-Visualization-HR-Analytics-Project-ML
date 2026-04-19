import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHR = user?.role === 'HR';

  const navLinks = [
    { label: 'Home', to: '/', show: 'always' },
    { label: 'Jobs', to: '/jobs', show: 'always' },
    { label: 'About Us', to: '/about', show: 'always' },
    { label: 'Recruitment', to: '/hr/dashboard', show: 'hr' },
    { label: 'Risk Analysis', to: '/hr/analytics', show: 'hr' },
    { label: 'Manage Jobs', to: '/hr/jobs', show: 'hr' },
    { label: 'Employees', to: '/hr/employees', show: 'hr' },
    { label: 'Onboarding', to: '/hr/onboard', show: 'hr' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-black text-sm">CH</span>
            </div>
            <span className="text-gray-900 dark:text-white font-black text-2xl tracking-tighter">
              Corp<span className="text-blue-500">HR</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 mx-8 flex-grow justify-center">
            {navLinks
              .filter(link => link.show === 'always' || (link.show === 'hr' && isHR))
              .map(link => (
                <Link
                  key={link.to + link.label}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>



          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-all shadow-sm"
              title="Toggle theme"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zm2.121 12.02a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.415zM7 11a1 1 0 100-2H6a1 1 0 100 2h1z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              )}
            </button>

            {user ? (
               <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-black text-sm transition-all active:scale-95"
               >
                  Logout 🔒
               </button>
            ) : (
               <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 font-black text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95"
               >
                  HR Portal 🚪
               </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-white/10 p-4 space-y-2 animate-in slide-in-from-top-1">

          {navLinks
            .filter(link => link.show === 'always' || (link.show === 'hr' && isHR))
            .map(link => (
              <Link
                key={link.to + link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-blue-500 transition-all"
              >
                {link.label}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}
