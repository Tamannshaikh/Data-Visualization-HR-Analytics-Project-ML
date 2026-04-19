import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        login(data.token, data.role, data.name);
        if (data.role === 'HR') navigate('/hr/dashboard');
        else navigate('/');
      } else {
        setError(data.message || 'Login failed. Check your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError('Cannot reach server. Is the backend running?');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-10 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-2xl shadow-black/10 p-10">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
              <span className="text-white font-black text-2xl tracking-tighter">CH</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Admin Portal</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Access your HR control center</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email or Username */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Email or Username</label>
              <input
                type="text"
                required
                placeholder="admin@corphr.com or johndoe123"
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Security Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 pr-14 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.225 0 2.39.271 3.431.755M21 21l-4.35-4.35m1.35-1.35C19.742 13.943 21 12 21 12c-1.274-4.057-5.064-7-9.542-7-1.225 0-2.39.271-3.431.755m-4.35-4.35L21 21M9 9l4.35 4.35"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authorizing...
                </>
              ) : (
                <>Authorize Access <span className="text-xl">🔒</span></>
              )}
            </button>
          </form>
        </div>

        {/* Security Help Box */}
        <div className="mt-8 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm">
          <p className="font-bold flex items-center gap-2 mb-2">
            <span className="text-lg">🛡️</span> Security Protocols Active
          </p>
          <ul className="space-y-2 opacity-80">
            <li>• Access restricted to registered HR/Admin personnel.</li>
            <li>• Multi-factor authentication may be required for specific tasks.</li>
            <li>• This session is encrypted and monitored for security compliance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
