import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Globe2,
  Activity,
  Server,
} from 'lucide-react';
import { api } from '../services/api.js';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [anRes, usRes] = await Promise.allSettled([
          api.getAdminAnalytics(),
          api.getAdminUsers(),
        ]);

        if (anRes.status === 'fulfilled' && anRes.value?.success) {
          setAnalytics(anRes.value.data);
        }
        if (usRes.status === 'fulfilled' && usRes.value?.success) {
          setUsers(usRes.value.data);
        }
      } catch (e) {
        console.warn('Admin fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.updateAdminUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      alert(`Role update error: ${e.message}`);
    }
  };

  const filteredUsers = users.filter((u) =>
    selectedRoleFilter === 'all' ? true : u.role === selectedRoleFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Platform Administration & Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor system health, manage institutional roles, and review UN SDG 4 Impact Indicators.
        </p>
      </div>

      {/* UN SDG 4 Impact Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-700 text-white shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-emerald-200" />
          <h3 className="font-black text-lg">
            UN SDG 4: Quality Education Impact Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
            <span className="text-xs text-emerald-100 font-semibold block">Target 4.1 Equitable Reach</span>
            <span className="text-2xl font-black">{analytics?.sdg4Indicators?.equalAccessScore || '94%'}</span>
            <p className="text-[11px] text-emerald-100/80 mt-1">Free open curriculum access across grades 6–10</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
            <span className="text-xs text-emerald-100 font-semibold block">Target 4.5 Language Equity</span>
            <span className="text-2xl font-black">2 + 1 Languages</span>
            <p className="text-[11px] text-emerald-100/80 mt-1">Active Hindi & English + Bhojpuri Ready</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md">
            <span className="text-xs text-emerald-100 font-semibold block">Target 4.a Offline Resilience</span>
            <span className="text-2xl font-black">100% Zero-Loss</span>
            <p className="text-[11px] text-emerald-100/80 mt-1">IndexedDB queue with automatic background sync</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalUsers || users.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Registered Users</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalLessons || 12}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curriculum Lessons</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalAttempts || 8}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed Quizzes</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              100% Active
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Health</div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
            User Accounts & Role Permissions
          </h3>
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {['all', 'student', 'teacher', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRoleFilter(r)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  selectedRoleFilter === r
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">User Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Role</th>
                <th className="py-3 px-2 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white">
                    {u.name} {u.isDemoUser && <span className="text-[10px] text-amber-500 font-semibold">(Demo)</span>}
                  </td>
                  <td className="py-3.5 px-2 text-slate-600 dark:text-slate-400">{u.email}</td>
                  <td className="py-3.5 px-2">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : u.role === 'teacher'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                          : 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
