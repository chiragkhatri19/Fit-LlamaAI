import React from 'react';
import { ResetIcon, LlamaIcon } from './Icons';

interface Props {
    onResetApp?: () => void;
    onLogoClick?: () => void;
}

const Header: React.FC<Props> = ({ onResetApp, onLogoClick }) => {
    return (
        <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                {onLogoClick ? (
                    <button 
                        onClick={onLogoClick}
                        className="flex items-center gap-3 hover:opacity-70 transition-all duration-200 group"
                    >
                        <LlamaIcon className="w-8 h-8 transition-transform group-hover:scale-105" />
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                            Fit Llama AI
                        </h1>
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <LlamaIcon className="w-8 h-8" />
                        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                            Fit Llama AI
                        </h1>
                    </div>
                )}
                {onResetApp && (
                    <button 
                        onClick={onResetApp} 
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
                        title="Reset all profile and meal data"
                    >
                        <ResetIcon className="w-4 h-4" />
                        <span className="hidden sm:inline font-medium">Reset</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

