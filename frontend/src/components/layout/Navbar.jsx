import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
            {/* LEFT: Branding */}
            <div className="flex-shrink-0 flex items-center">
                <Link
                    to="/dashboard"
                    className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
                >
                    AI Interview Coach
                </Link>
            </div>

            {/* CENTER: Navigation Tabs */}
            <div className="hidden md:flex flex-1 items-center justify-center h-full">
                <div className="flex h-full space-x-8">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center h-full border-b-2 text-sm font-medium transition-colors duration-200 ${isActive
                                ? 'border-blue-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/history"
                        className={({ isActive }) =>
                            `flex items-center h-full border-b-2 text-sm font-medium transition-colors duration-200 ${isActive
                                ? 'border-blue-500 text-white'
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`
                        }
                    >
                        History
                    </NavLink>
                </div>
            </div>

            {/* RIGHT: User & Logout */}
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
                    <span className="font-medium text-slate-300">{user.name}</span>
                </div>
                <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
                <button
                    onClick={logout}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Sign out"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
