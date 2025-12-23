import React from 'react';
import { Lightbulb, CheckCircle, BarChart2 } from 'lucide-react';

const ScoreBadge = ({ label, score, colorClass }) => (
    <div className="flex flex-col items-center">
        <div className={`text-lg font-bold ${colorClass}`}>{score}/10</div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</div>
    </div>
);

const FeedbackCard = ({ turn }) => {
    if (!turn.meta || !turn.meta.scores) return null;

    const { scores, detectedSkills } = turn.meta;

    // Safety check for detectedSkills
    const skills = Array.isArray(detectedSkills) ? detectedSkills : [];

    return (
        <div className="flex w-full justify-center mb-8 animate-fade-in">
            <div className="max-w-3xl w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50"></div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <Lightbulb size={24} />
                    </div>

                    <div className="flex-grow space-y-4">
                        {/* Header & Scores */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                AI Coach Feedback
                            </h4>
                            <div className="flex items-center gap-6 bg-slate-800/50 px-4 py-2 rounded-lg">
                                <ScoreBadge label="Correct" score={scores.correctness} colorClass="text-emerald-400" />
                                <ScoreBadge label="Clarity" score={scores.clarity} colorClass="text-blue-400" />
                                <ScoreBadge label="Conf" score={scores.confidence} colorClass="text-violet-400" />
                            </div>
                        </div>

                        {/* Feedback Text */}
                        <div className="text-slate-300 text-sm leading-relaxed">
                            <span className="font-semibold text-emerald-400">Insight: </span>
                            {turn.content}
                        </div>

                        {/* Skills Chips */}
                        {skills.length > 0 && (
                            <div className="pt-2">
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700 flex items-center gap-1"
                                        >
                                            <CheckCircle size={10} className="text-emerald-500" />
                                            {typeof skill === 'object' ? (skill.name || skill.skill || "Unknown Skill") : skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCard;
