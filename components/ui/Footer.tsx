
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 mt-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} Fit Llama AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

