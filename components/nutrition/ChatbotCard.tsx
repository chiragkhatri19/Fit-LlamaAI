import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile, Macros, Meal, ChatMessage } from '../../types';
import { getChatbotResponse } from '../../services/geminiService';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '../ui/Icons';

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
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold">Chat With Lorenzo</h3>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg mb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-lg' 
                            : 'bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`
                        }>
                            <p className="text-sm">{msg.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                         <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-slate-600">
                             <div className="flex items-center space-x-2">
                                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
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
                    className="flex-grow p-3 rounded-full border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !input.trim()} className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </form>
        </div>
    );
};

export default ChatbotCard;

