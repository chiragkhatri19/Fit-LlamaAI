import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile, Macros, Meal, ChatMessage } from '../../types';
import { getChatbotResponse } from '../../services/geminiService';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '../ui/Icons';
import { CardSpotlight } from '../ui/aceternity';

interface Props {
  userProfile: UserProfile;
  nutritionalGoals: Macros;
  meals: Meal[];
}

const ChatbotCard: React.FC<Props> = ({ userProfile, nutritionalGoals, meals }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'model',
            parts: [{ text: "No drama, just Llama! I'm Lorenzo, your personal nutrition coach. Got a question about your food journey? Spit it out!" }]
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await getChatbotResponse(input, newMessages, userProfile, nutritionalGoals, meals);
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <CardSpotlight className="p-6 border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Chat With Lorenzo</h3>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl mb-4 border border-slate-200/50 dark:border-slate-700/50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-sm shadow-sm' 
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm border border-slate-200 dark:border-slate-600'}`
                        }>
                            <p className="text-sm leading-relaxed">{msg.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                         <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-200 dark:border-slate-600">
                             <div className="flex items-center space-x-1.5">
                                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                             </div>
                         </div>
                     </div>
                )}
                <div ref={messagesEndRef} />
            </div>

                 <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                     <input
                         type="text"
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         placeholder="Ask your Llama Coach..."
                         className="flex-grow px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
                         disabled={isLoading}
                     />
                     <button
                         type="submit"
                         disabled={isLoading || !input.trim()}
                         className="p-2.5 sm:p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none min-w-[44px] min-h-[44px] flex items-center justify-center"
                         aria-label="Send message"
                     >
                         <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                     </button>
                 </form>
        </CardSpotlight>
    );
};

export default ChatbotCard;

