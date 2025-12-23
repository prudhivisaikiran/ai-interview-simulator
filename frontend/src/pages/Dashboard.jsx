import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SkillRadarChart from '../components/charts/RadarChart';
import { Play, TrendingUp, Award, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const { data } = await api.get('/sessions');
                setSessions(data.data.sessions);
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    // Derived Stats
    const totalSessions = sessions.length;
    // Calculate avg score if relevant (assuming session has overallScore now or in future)
    const avgScore = totalSessions > 0
        ? Math.round(sessions.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / totalSessions)
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-2">Welcome back, {user?.name}. Ready to practice?</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Total Interviews</p>
                            <h3 className="text-2xl font-bold mt-1 text-white">{totalSessions}</h3>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>
                <div className="card border-l-4 border-l-emerald-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Average Score</p>
                            <h3 className="text-2xl font-bold mt-1 text-white">{avgScore}%</h3>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Award size={24} />
                        </div>
                    </div>
                </div>
                <div className="card border-l-4 border-l-violet-500">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">Practice Time</p>
                            <h3 className="text-2xl font-bold mt-1 text-white">--</h3>
                        </div>
                        <div className="p-2 bg-violet-500/10 rounded-lg text-violet-500">
                            <Clock size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Action Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Start New */}
                    <div className="card bg-gradient-to-br from-surface to-slate-800 border-none relative overflow-hidden">
                        <div className="relative z-10 p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Start a New Mock Interview</h2>
                            <p className="text-slate-300 mb-6 max-w-lg">
                                Choose a topic and difficulty level to begin a realistic AI-driven interview session tailored to your needs.
                            </p>
                            <Link to="/new" className="btn-primary inline-flex items-center gap-2">
                                <Play size={20} fill="currentColor" />
                                Start Session
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-bold text-white mb-4">Recent Sessions</h3>
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-slate-500 text-center py-4">Loading sessions...</p>
                            ) : sessions.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No sessions yet. Start one above!</p>
                            ) : (
                                sessions.map((session) => (
                                    <Link to={`/session/${session._id}`} key={session._id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-700 group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold uppercase">
                                                {session.role.substring(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium capitalize">{session.role} Developer</h4>
                                                <p className="text-xs text-slate-500 capitalize">{new Date(session.createdAt).toLocaleDateString()} • {session.difficulty}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div>
                                                <span className="block text-emerald-400 font-bold">{session.overallScore || 0}%</span>
                                                <span className="text-xs text-slate-500">Score</span>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Chart */}
                <div className="lg:col-span-1">
                    <div className="card h-full">
                        <h3 className="text-lg font-bold text-white mb-4">Skill Gap Analysis</h3>
                        <p className="text-sm text-slate-400 mb-6">Your aggregated performance across all sessions.</p>
                        <div className="flex items-center justify-center">
                            <SkillRadarChart />
                        </div>
                        {/* Placeholder bars for now */}
                        <div className="mt-6 space-y-3">
                            <div className="text-center text-xs text-slate-500">
                                Complete more sessions to see detailed gap analysis.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
