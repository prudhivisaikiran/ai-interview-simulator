import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ turn }) => {
    const isQuestion = turn.type === 'question';

    return (
        <div className={`flex w-full mb-6 ${isQuestion ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isQuestion ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isQuestion ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-300'
                    }`}>
                    {isQuestion ? <Bot size={20} /> : <User size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl shadow-sm ${isQuestion
                        ? 'bg-slate-800 text-slate-100 rounded-tl-none'
                        : 'bg-primary/90 text-white rounded-tr-none'
                    }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">
                        {turn.content}
                    </p>
                    {isQuestion && (
                        <div className="mt-2 text-xs text-slate-500 font-medium uppercase tracking-wide">
                            Interviewer
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
