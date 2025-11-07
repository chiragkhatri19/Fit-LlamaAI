import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-blue-100/50 dark:border-slate-800/50 mt-auto">
               <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    &copy; {new Date().getFullYear()} Fit Llama AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
