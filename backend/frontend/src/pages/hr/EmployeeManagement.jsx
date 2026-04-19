import React, { useEffect, useState } from "react";
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

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: ROLES[0],
    department: DEPARTMENTS[0],
    email: "",
    joiningDate: ""
  });

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/employees", {
        headers: { 'x-auth-token': token }
      });
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employees. Please check your HR login status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/employees", formData, {
        headers: { 'x-auth-token': token }
      });
      setShowAddForm(false);
      setFormData({ name: "", role: ROLES[0], department: DEPARTMENTS[0], email: "", joiningDate: "" });
      fetchEmployees();
    } catch (err) {
      console.error("Error adding employee:", err);
      alert(err.response?.data?.message || "Failed to add employee");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/employees/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setDeleteConfirmId(null);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/employees/${editingEmployee}`, editFormData, {
        headers: { 'x-auth-token': token }
      });
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err);
      alert("Failed to update employee");
    }
  };

  if (loading) return <div className="text-center py-10 dark:text-white">Loading Employees...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Total active employees: {employees.length}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg whitespace-nowrap active:scale-95"
          >
            {showAddForm ? "Cancel" : "+ Add Employee"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">New Employee Details</h2>
          <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange} className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <select name="role" required value={formData.role} onChange={handleInputChange} className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select name="department" required value={formData.department} onChange={handleInputChange} className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer">
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleInputChange} className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <input type="date" name="joiningDate" required value={formData.joiningDate} onChange={handleInputChange} className="p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <button type="submit" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-all">Submit Entry</button>
          </form>
        </div>
      )}

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role & Dept</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joining Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {employees
                  .filter((emp) =>
                    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{emp.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{emp.role}</div>
                        <div className="text-xs text-blue-500 font-medium uppercase tracking-tighter">{emp.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{emp.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(emp.joiningDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {deleteConfirmId === emp._id ? (
                          <span className="inline-flex gap-2 items-center">
                            <span className="text-gray-500 dark:text-gray-400 text-xs">Remove?</span>
                            <button onClick={() => handleDeleteEmployee(emp._id)} className="bg-red-500 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition-all">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white text-xs font-bold px-3 py-1 rounded-lg transition-all">No</button>
                          </span>
                        ) : (
                          <span className="inline-flex gap-4">
                            <button onClick={() => { setEditingEmployee(emp._id); setEditFormData(emp); }} className="text-blue-500 hover:text-blue-700 transition-all font-bold">Edit</button>
                            <button onClick={() => setDeleteConfirmId(emp._id)} className="text-red-500 hover:text-red-700 transition-all font-bold">Remove</button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">No employees found. Add your first employee above!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Edit Employee</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Full Name" />
              <select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={editFormData.department} onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Email" />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">Save Changes</button>
                <button type="button" onClick={() => setEditingEmployee(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-3 rounded-xl transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
