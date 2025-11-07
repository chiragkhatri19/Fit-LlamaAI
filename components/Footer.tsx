
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 mt-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Llama Life Coach. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;