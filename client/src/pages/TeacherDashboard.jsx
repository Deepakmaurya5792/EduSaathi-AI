import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Search,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api.js';

export const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [insights, setInsights] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, insRes] = await Promise.allSettled([
          api.getTeacherStudents(),
          api.getTeacherClassInsights(),
        ]);

        if (stRes.status === 'fulfilled' && stRes.value?.success) {
          setStudents(stRes.value.data);
        }
        if (insRes.status === 'fulfilled' && insRes.value?.success) {
          setInsights(insRes.value.data);
        }
      } catch (e) {
        console.warn('Teacher fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setLoadingDetail(true);
    try {
      const res = await api.getTeacherStudentDetail(student.id);
      if (res.success) {
        setStudentDetail(res.data);
      }
    } catch (e) {
      console.warn('Detail load error:', e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Teacher Educator Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor student performance, detect conceptual bottlenecks early, and deploy AI-assisted remedial guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {students.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assigned Students</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {students.filter((s) => s.needsSupport).length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Students Needing Support</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {insights?.totalQuizAttempts || 12}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Assessments Taken</div>
          </div>
        </div>
      </div>

      {/* AI Pedagogical Recommendations */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50 to-teal-50 dark:from-slate-900 dark:to-slate-800/80 border border-brand-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            AI-Generated Class Teaching Recommendations
          </h3>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {(insights?.recommendedActions || [
            'Revise Linear Equations using the "Balance Scale" physical demonstration.',
            'Encourage daily 15-minute practice streaks to reinforce memory retention.',
            'Use bilingual Hindi/English terminology for students transitioning to English medium.',
          ]).map((act, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <span>{act}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Enrolled Students
            </h3>
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => handleSelectStudent(st)}
                className={`py-3.5 px-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition ${
                  selectedStudent?.id === st.id
                    ? 'bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {st.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Class {st.classGrade} • {st.preferredLanguage.toUpperCase()} • Streak: {st.streakCount}d
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-black block text-slate-900 dark:text-white">
                      {st.averageMastery}% Mastery
                    </span>
                    {st.needsSupport ? (
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        Needs Attention
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        On Track
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {selectedStudent ? (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Student Detailed Audit
                </span>
                <h3 className="font-black text-xl text-slate-900 dark:text-white mt-0.5">
                  {selectedStudent.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Class {selectedStudent.classGrade} • {selectedStudent.email}
                </p>
              </div>

              {loadingDetail ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading analysis...</div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs">
                    <h5 className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                      Targeted Remedial Plan:
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300">
                      {studentDetail?.remedialPlan || 'Student is performing consistently across curriculum.'}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Specific Concept Bottlenecks:
                    </h5>
                    {studentDetail?.identifiedGaps?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {studentDetail.identifiedGaps.map((gap, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                          >
                            {gap}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No critical concept gaps identified.</p>
                    )}
                  </div>

                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Topic Masteries:
                    </h5>
                    <div className="space-y-2">
                      {studentDetail?.masteries?.map((m) => (
                        <div key={m._id} className="text-xs">
                          <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            <span>{m.topicId?.title}</span>
                            <span>{m.masteryScore}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand-600"
                              style={{ width: `${m.masteryScore}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">Select a student from the list to view their detailed learning gaps and remediation plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
