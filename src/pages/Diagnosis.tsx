import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import { FaFileMedical, FaUserMd, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';

const Diagnosis: React.FC = () => {
    const { theme } = useTheme();
    // Mock data for now
    const [diagnoses] = useState([
        {
            id: 1,
            professional: "Dr. Sarah Johnson",
            date: "2024-03-15",
            title: "Generalized Anxiety Disorder",
            description: "Patient shows signs of persistent, excessive worry about various domains, including work and health. Symptoms include restlessness and difficulty concentrating.",
            status: "Active"
        }
    ]);

    return (
        <div className={`min-h-screen transition-all duration-500 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
            <DashboardHeader />
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Link to="/dashboard" className="inline-block mb-8 text-sm font-bold tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity">
                    ← Back to Dashboard
                </Link>

                <div className={`rounded-3xl p-8 shadow-xl transition-all duration-500 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl">
                                <FaFileMedical className="w-8 h-8 text-teal-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">My Diagnoses</h1>
                                <p className={`mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                    Medical records and professional assessments
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {diagnoses.length === 0 ? (
                            <div className="text-center py-20 border-2 border-dashed rounded-2xl opacity-50">
                                <FaFileMedical className="w-16 h-16 mx-auto mb-4" />
                                <p className="text-xl font-bold">No diagnoses yet</p>
                                <p className="text-sm">Assessments from professionals will appear here.</p>
                            </div>
                        ) : (
                            diagnoses.map(d => (
                                <div key={d.id} className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${theme === 'dark' ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300 uppercase tracking-wider">
                                                    {d.status}
                                                </span>
                                                <span className="text-sm opacity-50 flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" /> {d.date}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold">{d.title}</h3>
                                            <p className="opacity-70 leading-relaxed max-w-2xl">{d.description}</p>
                                            <div className="flex items-center gap-2 pt-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <FaUserMd className="text-gray-500" />
                                                </div>
                                                <span className="text-sm font-medium">{d.professional}</span>
                                            </div>
                                        </div>
                                        <button className="p-2 opacity-50 hover:opacity-100">
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Diagnosis;
