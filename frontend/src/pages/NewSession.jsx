import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Play, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewSession = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        role: 'frontend',
        difficulty: 'junior',
        mode: 'technical',
        length: 'unlimited'
    });

    const roles = [
        { id: 'frontend', label: 'Frontend Developer' },
        { id: 'backend', label: 'Backend Developer' },
        { id: 'ml', label: 'Machine Learning Engineer' },
        { id: 'sde', label: 'Software Development Engineer' }
    ];

    const difficulties = [
        { id: 'junior', label: 'Junior' },
        { id: 'mid', label: 'Mid-Senior' },
        { id: 'senior', label: 'Senior' }
    ];

    const modes = [
        { id: 'technical', label: 'Technical Core' },
        { id: 'behavioral', label: 'Behavioral & Soft Skills' },
        { id: 'mixed', label: 'Mixed Assessment' }
    ];

    const lengths = [
        { id: 'unlimited', label: 'Unlimited', description: 'No question limit' },
        { id: 'quick', label: 'Quick', description: '5 questions' },
        { id: 'full', label: 'Full', description: '10 questions' },
        { id: 'deep', label: 'Deep', description: '15 questions' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await api.post('/sessions', formData);
            if (data.status === 'success') {
                navigate(`/session/${data.data.session._id}`);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
            </Link>

            <div className="card max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Configure Your Interview</h1>
                    <p className="text-slate-400">Customize the AI interviewer's persona and difficulty level.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Target Role</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                    className={`p-4 rounded-lg border text-left transition-all ${formData.role === role.id
                                        ? 'bg-primary/20 border-primary text-white ring-1 ring-primary'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="font-semibold block">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Difficulty Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {difficulties.map(diff => (
                                <button
                                    key={diff.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, difficulty: diff.id })}
                                    className={`p-3 rounded-lg border text-center transition-all ${formData.difficulty === diff.id
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="font-medium">{diff.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Interview Focus</label>
                        <div className="grid grid-cols-3 gap-3">
                            {modes.map(mode => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mode: mode.id })}
                                    className={`p-3 rounded-lg border text-center transition-all ${formData.mode === mode.id
                                        ? 'bg-violet-500/20 border-violet-500 text-violet-400 ring-1 ring-violet-500'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="font-medium block">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Length Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Interview Length</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {lengths.map(length => (
                                <button
                                    key={length.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, length: length.id })}
                                    className={`p-3 rounded-lg border text-center transition-all ${formData.length === length.id
                                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 ring-1 ring-blue-500'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <span className="font-medium block">{length.label}</span>
                                    <span className="text-xs text-slate-500 mt-1 block">{length.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center py-4 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> Creating Session...
                                </>
                            ) : (
                                <>
                                    <Play size={20} className="mr-2" fill="currentColor" /> Start Interview
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewSession;
