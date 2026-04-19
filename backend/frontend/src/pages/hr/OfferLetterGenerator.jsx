import React, { useState } from "react";
import axios from "axios";

const DEPARTMENTS = [
  "Engineering", "HR", "Marketing", "Sales", "Finance", 
  "Operations", "Legal", "Product", "Design", "Customer Success"
];

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "UI/UX Designer", "HR Manager", "HR Specialist", "Product Manager", 
  "Data Scientist", "Marketing Executive", "Sales Associate", "DevOps Engineer"
];

export default function OfferLetterGenerator() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: ROLES[0],
    department: DEPARTMENTS[0],
    salary: "",
    password: ""
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus("Generating offer letter and sending email...");
      const token = localStorage.getItem("token");
      await axios.post("/api/employees/onboard", formData, {
        headers: { 'x-auth-token': token }
      });
      setStatus("Success! Offer letter sent and employee created.");
      setFormData({
        name: "", username: "", email: "", role: ROLES[0], department: DEPARTMENTS[0], salary: "", password: ""
      });
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || "Error generating offer letter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Automated Onboarding & Offers</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate a PDF offer letter, create login accounts, and email everything to a new hire with one click.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-xl">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Candidate Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Candidate Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. john@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Assign Username (Login ID)</label>
            <input type="text" name="username" required value={formData.username} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. johndoe123" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Job Title / Role</label>
            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Department</label>
            <select name="department" value={formData.department} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Salary (e.g., $120,000 / year)</label>
            <input type="text" name="salary" required value={formData.salary} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="$120,000 / year" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Set Account Password</label>
            <input type="text" name="password" required value={formData.password} onChange={handleInputChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Welcome@123" />
          </div>

          <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all">
              {loading ? "Processing..." : "Generate Offfer & Send Onboarding Email"}
            </button>
          </div>
        </form>

        {status && (
          <div className={`mt-6 p-4 rounded-xl font-medium border ${status.includes("Success") ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
