import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, CheckCircle, Clock, TrendingUp, Trophy, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import SkillRadarChart from '../charts/RadarChart';

const AssessmentTab = ({ sessionId, refreshTrigger }) => {
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState(null);
    const [error, setError] = useState(null);

    const fetchAssessment = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/sessions/${sessionId}/assessment`);
            setAssessment(data.data);
        } catch (err) {
            console.error("Failed to fetch assessment:", err);
            setError("Could not load assessment data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionId) {
            fetchAssessment();
        }
    }, [sessionId, refreshTrigger]); // Refresh when refreshTrigger changes

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-400">
                <div className="animate-pulse">Analyzing performance...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <AlertCircle size={48} className="mb-4 text-slate-600" />
                <p className="mb-4">{error}</p>
                <button
                    onClick={fetchAssessment}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                    <RefreshCw size={16} /> Retry
                </button>
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <AlertCircle size={48} className="mb-4 text-slate-600" />
                <p>No assessment data available.</p>
            </div>
        );
    }

    // Transform API data for Radar Chart
    const radarChartData = assessment.radar?.labels?.map((label, idx) => ({
        subject: label,
        A: assessment.radar.values[idx] || 0,
        fullMark: 100
    })) || [];

    // Ensure we have valid radar data (at least 3 points)
    const hasValidRadarData = radarChartData.length >= 3 &&
        radarChartData.every(d => typeof d.A === 'number');

    return (
        <div className="space-y-8 animate-fade-in p-2 sm:p-0">

            {/* 1. Radar Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Trophy className="text-yellow-500" size={20} />
                        Skill Profile
                    </h3>
                    <div className="flex items-center justify-center">
                        {hasValidRadarData ? (
                            <SkillRadarChart data={radarChartData} />
                        ) : (
                            <div className="text-slate-500 text-sm py-10">
                                Answer more questions to generate chart
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Top Skills Gaps */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="text-red-400" size={20} />
                        Priority Gaps
                    </h3>
                    <div className="space-y-4">
                        {assessment.gaps && assessment.gaps.length > 0 ? (
                            assessment.gaps.map((gap, idx) => (
                                <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-slate-200 font-medium">{gap.skill}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{gap.reason}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-emerald-400 flex items-center gap-2">
                                <CheckCircle size={16} /> No major gaps found!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Skills List */}
            {assessment.skills && assessment.skills.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-white mb-6">All Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assessment.skills.map((skill, idx) => (
                            <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-200 font-medium">{skill.name}</span>
                                    <span className={`font-bold ${skill.score >= 70 ? 'text-emerald-400' : skill.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {skill.score}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${skill.score >= 70 ? 'bg-emerald-500' : skill.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${skill.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. Detailed Recommendations */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-white mb-6">Personalized Growth Plan</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quick Wins */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2">
                            <Clock size={16} /> Quick Fix (1-2 Days)
                        </div>
                        {assessment.recommendations?.quickFix?.map((rec, i) => (
                            <div key={i} className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded border-l-2 border-emerald-500">
                                {rec}
                            </div>
                        ))}
                    </div>

                    {/* Build Strength */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                            <Clock size={16} /> Build Strength (1-2 Weeks)
                        </div>
                        {assessment.recommendations?.buildStrength?.map((rec, i) => (
                            <div key={i} className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded border-l-2 border-blue-500">
                                {rec}
                            </div>
                        ))}
                    </div>

                    {/* Long Term */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
                            <Clock size={16} /> Interview Ready (1 Month)
                        </div>
                        {assessment.recommendations?.interviewReady?.map((rec, i) => (
                            <div key={i} className="text-sm text-slate-400 bg-slate-800/30 p-3 rounded border-l-2 border-purple-500">
                                {rec}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentTab;
