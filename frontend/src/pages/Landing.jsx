import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BarChart2, Shield } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center space-y-8 py-20 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10"></div>

                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-violet-500 to-emerald-400 bg-clip-text text-transparent pb-2">
                    Master Your Next <br /> Tech Interview
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    AI-powered mock interviews with real-time feedback, detailed skill gap analysis, and personalized coaching.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/register" className="btn-primary text-lg px-8 py-3 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all">
                        Get Started Free
                    </Link>
                    <Link to="/login" className="px-8 py-3 rounded-full border border-slate-600 hover:bg-slate-800 transition-colors font-medium">
                        Log In
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-slate-900/50 py-20 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
                            <MessageSquare size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Realistic Simulations</h3>
                        <p className="text-slate-400">
                            Practice with an AI interviewer that adapts to your responses and asks follow-up questions.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 mb-4">
                            <BarChart2 size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
                        <p className="text-slate-400">
                            Get comprehensive feedback on your technical accuracy, communication style, and more.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Personalized Growth</h3>
                        <p className="text-slate-400">
                            Identify your skill gaps and get tailored resources to improve before your real interview.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
