import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUsers, FaUserMd, FaUserShield, FaSearch, FaFilter,
    FaEllipsisV, FaDownload, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaChevronRight
} from 'react-icons/fa';
import DashboardHeader from './DashboardHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    phone?: string;
    dob?: string;
    id_type?: string;
    id_image?: string;
    specialization?: string;
    profile_photo?: string;
    certificates?: string;
    bio?: string;
    verified?: boolean;
}

const Admin: React.FC = () => {
    const { theme } = useTheme();
    const { user, fetchWithAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.type !== 'admin') {
            if (user.type === 'professional' || user.type === 'listener') {
                navigate('/professionals');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, navigate]);
    const [activeTab, setActiveTab] = useState<'clients' | 'professionals' | 'admins'>('clients');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<{
        clients: UserData[];
        professionals: UserData[];
        admins: UserData[];
    }>({
        clients: [],
        professionals: [],
        admins: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await fetchWithAuth('http://127.0.0.1:8000/api/auth/users/');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchWithAuth]);

    const handleVerifyUser = async (userId: number) => {
        try {
            const response = await fetchWithAuth(`http://127.0.0.1:8000/api/auth/users/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    verified: true
                }),
            });

            if (response.ok) {
                // Refresh logic
                fetchUsers();
                if (selectedUser && selectedUser.id === userId) {
                    setSelectedUser({ ...selectedUser, verified: true });
                }
                alert('User verified successfully!');
            } else {
                const err = await response.json();
                alert('Failed to verify user: ' + JSON.stringify(err));
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('An error occurred during verification.');
        }
    };

    const filteredUsers = users[activeTab].filter(user =>
        (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const TableHeader = ({ title, icon: Icon, count }: { title: string, icon: any, count: number }) => (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${activeTab === title.toLowerCase().slice(0, -1) + 's'
                ? 'bg-[#25A8A0] text-white shadow-lg shadow-[#25A8A0]/20'
                : theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-400 shadow-sm'
                }`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
                <p className="text-sm text-gray-500 font-medium">{count} Total Registered</p>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <DashboardHeader />

            <main className="container mx-auto px-4 py-10 max-w-7xl">
                {/* Admin Hero Section */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Admin Management</h1>
                    <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage and oversee all users across various roles in the SoulTalk platform.
                    </p>
                </div>

                {/* Role Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`p-6 rounded-3xl border-2 transition-all duration-300 text-left ${activeTab === 'clients'
                            ? 'border-[#25A8A0] bg-[#25A8A0]/5 shadow-xl shadow-[#25A8A0]/5'
                            : theme === 'dark' ? 'border-gray-800 bg-gray-800/40 hover:border-gray-700' : 'border-white bg-white hover:border-gray-100 shadow-sm'
                            }`}
                    >
                        <FaUsers className={`w-8 h-8 mb-3 ${activeTab === 'clients' ? 'text-[#25A8A0]' : 'text-gray-400'}`} />
                        <h3 className="text-2xl font-bold">{users.clients.length}</h3>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Clients</p>
                    </button>

                    <button
                        onClick={() => setActiveTab('professionals')}
                        className={`p-6 rounded-3xl border-2 transition-all duration-300 text-left ${activeTab === 'professionals'
                            ? 'border-[#25A8A0] bg-[#25A8A0]/5 shadow-xl shadow-[#25A8A0]/5'
                            : theme === 'dark' ? 'border-gray-800 bg-gray-800/40 hover:border-gray-700' : 'border-white bg-white hover:border-gray-100 shadow-sm'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <FaUserMd className={`w-8 h-8 mb-3 ${activeTab === 'professionals' ? 'text-[#25A8A0]' : 'text-gray-400'}`} />
                            {users.professionals.filter(p => !p.verified).length > 0 && (
                                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                                    {users.professionals.filter(p => !p.verified).length} PENDING
                                </span>
                            )}
                        </div>
                        <h3 className="text-2xl font-bold">{users.professionals.length}</h3>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Professionals</p>
                    </button>

                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`p-6 rounded-3xl border-2 transition-all duration-300 text-left ${activeTab === 'admins'
                            ? 'border-[#25A8A0] bg-[#25A8A0]/5 shadow-xl shadow-[#25A8A0]/5'
                            : theme === 'dark' ? 'border-gray-800 bg-gray-800/40 hover:border-gray-700' : 'border-white bg-white hover:border-gray-100 shadow-sm'
                            }`}
                    >
                        <FaUserShield className={`w-8 h-8 mb-3 ${activeTab === 'admins' ? 'text-[#25A8A0]' : 'text-gray-400'}`} />
                        <h3 className="text-2xl font-bold">{users.admins.length}</h3>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Admin Staff</p>
                    </button>
                </div>

                {/* Table Container */}
                <div className={`rounded-3xl border overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'}`}>
                    {/* Table Filters & Search */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none transition-all border ${theme === 'dark'
                                    ? 'bg-gray-900 border-gray-700 focus:border-[#25A8A0] text-white'
                                    : 'bg-gray-50 border-gray-200 focus:border-[#25A8A0] focus:bg-white text-gray-900'
                                    }`}
                            />
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border font-bold transition-all ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700 text-gray-300' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                }`}>
                                <FaFilter className="w-4 h-4" />
                                Filter
                            </button>
                            <button className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#25A8A0] text-white font-bold shadow-lg hover:shadow-xl hover:bg-[#1e8a82] transition-all`}>
                                <FaDownload className="w-4 h-4" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={`text-xs uppercase tracking-wider font-bold ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                                <tr>
                                    <th className="px-8 py-4">User</th>
                                    <th className="px-8 py-4">Role</th>
                                    <th className="px-8 py-4">Email</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-[#25A8A0] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-500 font-bold">Loading user directory...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                                    <FaUsers className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-bold text-xl">No users found</p>
                                                <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} className={`transition-colors cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}`} onClick={() => setSelectedUser(u)}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-[#25A8A0]/10 border border-[#25A8A0]/20 shadow-sm">
                                                        {u.profile_photo ? (
                                                            <img src={`http://127.0.0.1:8000${u.profile_photo}`} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="font-bold text-lg text-[#25A8A0]">
                                                                {u.first_name ? u.first_name[0] : (u.username ? u.username[0].toUpperCase() : 'U')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-base leading-none mb-1">
                                                            {u.first_name} {u.last_name || u.username}
                                                        </p>
                                                        <p className="text-sm text-gray-500 font-medium">@{u.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                                                        : u.role === 'professional'
                                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                    {u.role === 'professional' && (
                                                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${u.verified ? 'text-green-500' : 'text-orange-500'}`}>
                                                            {u.verified ? 'Verified' : 'Pending Verification'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 font-medium">
                                                {u.email}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Active</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}>
                                                    <FaChevronRight className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Placeholder */}
                    <div className={`p-6 border-t font-medium text-sm flex justify-between items-center ${theme === 'dark' ? 'border-gray-700 bg-gray-900/30' : 'border-gray-100 bg-gray-50'}`}>
                        <p className="text-gray-500">Showing {filteredUsers.length} of {users[activeTab].length} entries</p>
                        <div className="flex gap-2">
                            <button className={`px-4 py-2 rounded-xl border font-bold disabled:opacity-50 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-white shadow-sm'}`} disabled>Previous</button>
                            <button className={`px-4 py-2 rounded-xl border font-bold disabled:opacity-50 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-white shadow-sm'}`} disabled>Next</button>
                        </div>
                    </div>
                </div>

                {/* User Detail Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedUser(null)}>
                        <div className={`w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 scale-100 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
                            <div className="relative h-40 bg-gradient-to-r from-[#25A8A0] to-teal-600">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md"
                                >
                                    <FaTimesCircle className="w-5 h-5" />
                                </button>
                                {selectedUser.role === 'professional' && (
                                    <div className="absolute top-6 left-10">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-xl border ${selectedUser.verified ? 'bg-green-500/20 text-white border-green-500/30' : 'bg-orange-500/20 text-white border-orange-500/30'}`}>
                                            {selectedUser.verified ? 'Verified Account' : 'Pending Review'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="px-10 pb-10">
                                <div className="relative -mt-20 mb-8 flex flex-col md:flex-row md:items-end gap-6 text-center md:text-left">
                                    <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl bg-gray-100 mx-auto md:mx-0">
                                        {selectedUser.profile_photo ? (
                                            <img src={`http://127.0.0.1:8000${selectedUser.profile_photo}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#25A8A0] text-white text-5xl font-black">
                                                {selectedUser.first_name?.[0] || selectedUser.username?.[0].toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <h2 className="text-3xl font-black mb-1">{selectedUser.first_name} {selectedUser.last_name}</h2>
                                        <p className="text-[#25A8A0] font-black uppercase tracking-[0.2em] text-sm">
                                            {selectedUser.role === 'professional' ? (selectedUser.specialization || 'Professional') : selectedUser.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Contact Details</label>
                                            <div className="space-y-2">
                                                <p className="font-bold flex items-center gap-3">
                                                    <span className="text-gray-400">Email:</span> {selectedUser.email}
                                                </p>
                                                {selectedUser.phone && (
                                                    <p className="font-bold flex items-center gap-3">
                                                        <span className="text-gray-400">Phone:</span> {selectedUser.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Personal Info</label>
                                            <div className="space-y-2">
                                                {selectedUser.dob && (
                                                    <p className="font-bold flex items-center gap-3">
                                                        <span className="text-gray-400">DOB:</span> {new Date(selectedUser.dob).toLocaleDateString()}
                                                    </p>
                                                )}
                                                <p className="font-bold flex items-center gap-3">
                                                    <span className="text-gray-400">Username:</span> @{selectedUser.username}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {selectedUser.role === 'professional' && (
                                            <>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Professional Documents</label>
                                                    <div className="space-y-3">
                                                        {selectedUser.id_image && (
                                                            <a
                                                                href={`http://127.0.0.1:8000${selectedUser.id_image}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all hover:bg-[#25A8A0]/5 hover:border-[#25A8A0]/50 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FaUserShield /></div>
                                                                    <div>
                                                                        <p className="text-xs font-black uppercase tracking-tight">ID Document</p>
                                                                        <p className="text-[10px] text-gray-400">{selectedUser.id_type || 'Identity Verification'}</p>
                                                                    </div>
                                                                </div>
                                                                <FaDownload className="w-3 h-3 text-gray-400" />
                                                            </a>
                                                        )}
                                                        {selectedUser.certificates && (
                                                            <a
                                                                href={`http://127.0.0.1:8000${selectedUser.certificates}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all hover:bg-[#25A8A0]/5 hover:border-[#25A8A0]/50 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FaCrown /></div>
                                                                    <div>
                                                                        <p className="text-xs font-black uppercase tracking-tight">Certificates</p>
                                                                        <p className="text-[10px] text-gray-400">Professional Qualification</p>
                                                                    </div>
                                                                </div>
                                                                <FaDownload className="w-3 h-3 text-gray-400" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Bio / Description</label>
                                            <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {selectedUser.bio || "No biography provided by user."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                                    {selectedUser.role === 'professional' && !selectedUser.verified && (
                                        <button
                                            onClick={() => handleVerifyUser(selectedUser.id)}
                                            className="flex-1 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaCheckCircle /> Verify Account
                                        </button>
                                    )}
                                    <button className="flex-1 py-4 bg-[#25A8A0] text-white font-black rounded-2xl shadow-xl shadow-[#25A8A0]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                        Contact User
                                    </button>
                                    <button className={`flex-1 py-4 font-black rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                        Manage Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
