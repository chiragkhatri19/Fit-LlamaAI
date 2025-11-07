import React from 'react';
import { ResetIcon, LlamaIcon } from './Icons';

interface Props {
    onResetApp?: () => void;
    onLogoClick?: () => void;
}

const Header: React.FC<Props> = ({ onResetApp, onLogoClick }) => {
    return (
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                {onLogoClick ? (
                    <button 
                        onClick={onLogoClick}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <LlamaIcon className="w-10 h-10" />
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            Fit Llama AI
                        </h1>
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <LlamaIcon className="w-10 h-10" />
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            Fit Llama AI
                        </h1>
                    </div>
                )}
                {onResetApp && (
                    <button 
                        onClick={onResetApp} 
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                        title="Reset all profile and meal data"
                    >
                        <ResetIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Reset Profile</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

