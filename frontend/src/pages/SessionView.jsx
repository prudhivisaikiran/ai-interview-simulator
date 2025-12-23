import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Bot, ArrowLeft, Send, Download, MonitorPlay, FileText } from 'lucide-react';
import api from '../services/api';
import ChatMessage from '../components/session/ChatMessage';
import FeedbackCard from '../components/session/FeedbackCard';
import AssessmentTab from '../components/session/AssessmentTab';

const SessionView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'assessment'

    const [session, setSession] = useState(null);
    const [turns, setTurns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Chat State
    const [answerText, setAnswerText] = useState('');
    const [sending, setSending] = useState(false);
    const [completionData, setCompletionData] = useState(null);
    const [assessmentRefresh, setAssessmentRefresh] = useState(0); // Trigger for assessment refresh
    const bottomRef = useRef(null);

    // ... existing useEffects ... 
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data } = await api.get(`/sessions/${id}`);
                setSession(data.data.session);

                const loadedTurns = data.data.turns || [];
                setTurns(loadedTurns);

                if (loadedTurns.length === 0) {
                    await startSession();
                }
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
                setError('Failed to load session');
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [id]);

    useEffect(() => {
        if (activeTab === 'chat') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [turns, activeTab]);

    const startSession = async () => {
        try {
            const { data } = await api.post(`/sessions/${id}/start`);
            setTurns([data.data.turn]);
        } catch (err) {
            console.error(err);
            setError("Failed to start session. Please refresh.");
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!answerText.trim() || sending) return;

        setSending(true);
        try {
            const { data } = await api.post(`/sessions/${id}/answer`, { answerText });

            if (!data?.data) throw new Error("Invalid response");

            // Check if interview is completed
            if (data.data.completed) {
                const { answerTurn, feedbackTurn, summary } = data.data;
                const newTurns = [answerTurn, feedbackTurn].filter(Boolean);
                setTurns(prev => [...prev, ...newTurns]);
                setCompletionData(summary);

                // Refresh session to get updated completion status
                const sessionResponse = await api.get(`/sessions/${id}`);
                setSession(sessionResponse.data.data.session);
            } else {
                const { answerTurn, feedbackTurn, nextQuestionTurn } = data.data;
                const newTurns = [answerTurn, feedbackTurn, nextQuestionTurn].filter(Boolean);
                setTurns(prev => [...prev, ...newTurns]);
            }

            // Trigger assessment refresh after every answer
            setAssessmentRefresh(prev => prev + 1);

            setAnswerText('');
        } catch (err) {
            console.error(err);
            setError("Failed to send answer. Try again.");
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            // allow new line
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await api.get(`/sessions/${id}/report`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `interview-report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed", err);
            // Optional: show toast
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mr-2" /> Loading session...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950">
            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center px-4 sm:px-6 justify-between flex-shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-white font-semibold text-lg sm:text-xl">
                            {session?.role || "Interview Session"}
                        </h1>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{session?.difficulty} Level</span>
                            <span>•</span>
                            <span>{session?.mode} Mode</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Progress Indicator */}
                    {session && (
                        <div className="text-xs text-slate-500 font-mono mr-2">
                            {session.maxQuestions
                                ? `Question ${session.questionCount}/${session.maxQuestions}`
                                : `Question ${session.questionCount}`
                            }
                        </div>
                    )}
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition border border-slate-700"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download Report</span>
                    </button>
                    <div className="text-xs text-slate-600 font-mono hidden sm:block">
                        ID: {id?.substring(0, 6)}
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="flex justify-center border-b border-slate-800 bg-slate-900/50">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'chat'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <MonitorPlay size={16} /> Live Interview
                </button>
                <button
                    onClick={() => setActiveTab('assessment')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'assessment'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <FileText size={16} /> Skill Assessment
                </button>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow overflow-hidden relative">

                {/* 1. CHAT VIEW */}
                {activeTab === 'chat' && (
                    <div className="flex flex-col h-full animate-fade-in">
                        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-2 custom-scrollbar">
                            {turns.map((turn, index) => {
                                if (!turn) return null;
                                if (turn.type === 'feedback') {
                                    return <FeedbackCard key={turn._id || index} turn={turn} />;
                                }
                                return <ChatMessage key={turn._id || index} turn={turn} />;
                            })}

                            {sending && (
                                <div className="flex w-full mb-6 justify-start animate-pulse">
                                    <div className="flex max-w-[80%] gap-3 flex-row">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                            <Bot size={20} />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-400 rounded-tl-none text-sm">
                                            AI is thinking...
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Completion Card */}
                            {(session?.isCompleted || completionData) && (
                                <div className="flex w-full justify-center mb-6 animate-fade-in">
                                    <div className="max-w-2xl w-full bg-gradient-to-br from-emerald-900/30 to-blue-900/30 border border-emerald-500/30 rounded-xl p-6 shadow-lg">
                                        <div className="text-center mb-6">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                                                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Interview Completed!</h3>
                                            <p className="text-slate-400">Great job! Here's your performance summary.</p>
                                        </div>

                                        {completionData && (
                                            <div className="grid grid-cols-4 gap-4 mb-6">
                                                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                    <div className="text-2xl font-bold text-emerald-400">{completionData.avgCorrectness}</div>
                                                    <div className="text-xs text-slate-500 mt-1">Correctness</div>
                                                </div>
                                                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                    <div className="text-2xl font-bold text-blue-400">{completionData.avgClarity}</div>
                                                    <div className="text-xs text-slate-500 mt-1">Clarity</div>
                                                </div>
                                                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                    <div className="text-2xl font-bold text-violet-400">{completionData.avgConfidence}</div>
                                                    <div className="text-xs text-slate-500 mt-1">Confidence</div>
                                                </div>
                                                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                    <div className="text-2xl font-bold text-yellow-400">{completionData.overallScore}</div>
                                                    <div className="text-xs text-slate-500 mt-1">Overall</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => setActiveTab('assessment')}
                                                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                                            >
                                                View Assessment
                                            </button>
                                            <button
                                                onClick={handleDownloadReport}
                                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                                            >
                                                Download PDF
                                            </button>
                                            <button
                                                onClick={() => navigate('/new')}
                                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
                                            >
                                                New Interview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            {session?.isCompleted ? (
                                <div className="max-w-4xl mx-auto text-center py-4">
                                    <p className="text-slate-500 text-sm">
                                        This interview has been completed. Start a new interview to continue practicing.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative cursor-text">
                                    <textarea
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={sending}
                                        placeholder="Type your answer here... (Shift+Enter for new line)"
                                        className="w-full bg-slate-900 text-white rounded-xl pl-4 pr-12 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none min-h-[50px] max-h-[150px] shadow-inner"
                                        rows={1}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!answerText.trim() || sending}
                                        className="absolute right-3 bottom-2.5 p-2 bg-primary hover:bg-primary-dark disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-all active:scale-95"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            )}
                            <div className="text-center mt-2 text-[10px] text-slate-600">
                                AI can make mistakes. Consider checking important info.
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. ASSESSMENT VIEW */}
                {activeTab === 'assessment' && (
                    <div className="h-full overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                        <div className="max-w-6xl mx-auto">
                            <AssessmentTab sessionId={id} refreshTrigger={assessmentRefresh} />
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default SessionView;
