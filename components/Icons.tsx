import React from 'react';

// Props type for all icons
type IconProps = React.SVGProps<SVGSVGElement>;

export const LlamaIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
        <defs>
            <linearGradient id="llama-bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#8b5cf6'}} />
                <stop offset="100%" style={{stopColor: '#3b82f6'}} />
            </linearGradient>
            <linearGradient id="llama-fur-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" style={{stopColor: '#e0e7ff'}} />
                <stop offset="100%" style={{stopColor: '#c7d2fe'}} />
            </linearGradient>
            <filter id="llama-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset in="blur" dy="2" result="offsetBlur" />
                <feMerge>
                    <feMergeNode in="offsetBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <rect width="92" height="92" x="4" y="4" rx="28" fill="url(#llama-bg-gradient)" filter="url(#llama-shadow)" />
        <g transform="translate(15, 20) scale(0.7)">
            <path d="M82.8,77.2c-2.4,1.8-5.1,3.3-7.9,4.4c-11.2,4.4-23.7,4.4-34.9,0c-2.8-1.1-5.5-2.6-7.9-4.4c-2-1.5-3.8-3.1-5.4-4.9c-9.1-9.9-9.1-26,0-35.8c1.6-1.8,3.4-3.4,5.4-4.9c4.9-3.6,10.6-6,16.8-6.9c0.5,0,1,0.2,1.3,0.6c0.3,0.4,0.4,0.9,0.3,1.4c-0.4,2.2-0.6,4.4-0.6,6.6c0,2.1,0.2,4.1,0.5,6.1c0.1,0.5-0.1,1-0.5,1.3c-0.4,0.3-0.9,0.4-1.4,0.2c-3.1-0.9-6-0.4-8.7,1.4c-5.7,3.8-7.9,11.3-5.2,17.5c2.1,5,6.9,8.4,12.2,8.9c0.5,0,1,0.3,1.3,0.7c0.3,0.4,0.3,1,0.1,1.4c-0.8,1.8-1.4,3.6-1.8,5.4c-0.3,1.2,0.6,2.3,1.8,2.3h16c1.2,0,2.1-1.1,1.8-2.3c-0.4-1.9-1-3.7-1.8-5.4c-0.2-0.5-0.1-1,0.1-1.4c0.3-0.4,0.7-0.7,1.3-0.7c5.3-0.4,10-3.9,12.2-8.9c2.7-6.2,0.5-13.7-5.2-17.5c-2.7-1.8-5.6-2.3-8.7-1.4c-0.5,0.1-1.1,0-1.4-0.2c-0.4-0.3-0.6-0.8-0.5-1.3c0.3-2,0.5-4,0.5-6.1c0-2.2-0.2-4.4-0.6-6.6c-0.1-0.5,0-1,0.3-1.4c0.3-0.4,0.8-0.6,1.3-0.6c6.2,0.9,11.9,3.3,16.8,6.9c2,1.5,3.8,3.1,5.4,4.9c9.1,9.9,9.1,26,0,35.8C86.6,74.1,84.8,75.7,82.8,77.2z" fill="url(#llama-fur-gradient)"/>
            <circle cx="65" cy="41.4" r="6" fill="#1e293b"/>
            <circle cx="35" cy="41.4" r="6" fill="#1e293b"/>
            <path d="M57.5,60.7c0,4.1-3.4,7.5-7.5,7.5s-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5S57.5,56.6,57.5,60.7z" fill="white"/>
            <path d="M54.3,58.5c-0.8,1.3-2.2,2.1-3.8,2.1c-1.6,0-3-0.8-3.8-2.1c-0.4-0.6-1.2-0.8-1.8-0.4c-0.6,0.4-0.8,1.2-0.4,1.8c1.2,1.8,3.2,2.9,5.4,2.9c2.2,0,4.2-1.1,5.4-2.9c0.4-0.6,0.2-1.4-0.4-1.8C55.5,57.7,54.7,57.9,54.3,58.5z" fill="#1e293b"/>
        </g>
    </svg>
);

export const AnimatedLlamaLoader: React.FC<IconProps> = (props) => (
    <>
    <style>{`
        @keyframes llama-bob {
            0%, 100% { transform: translateY(0) rotate(-2deg); }
            50% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes llama-ear-twitch {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-8deg); }
        }
        .llama-head-bob { animation: llama-bob 1.5s infinite ease-in-out; transform-origin: center; }
        .llama-ear-animated { animation: llama-ear-twitch 2s infinite ease-in-out; transform-origin: 50% 90%; }
    `}</style>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
        <g className="llama-head-bob">
            <path d="M82.8,77.2c-2.4,1.8-5.1,3.3-7.9,4.4c-11.2,4.4-23.7,4.4-34.9,0c-2.8-1.1-5.5-2.6-7.9-4.4c-2-1.5-3.8-3.1-5.4-4.9c-9.1-9.9-9.1-26,0-35.8c1.6-1.8,3.4-3.4,5.4-4.9c4.9-3.6,10.6-6,16.8-6.9c-0.4,4.4-0.6,8.8-0.6,13.2c0,4.2,0.4,8.2,1.2,12.1c-3.1-0.9-6-0.4-8.7,1.4c-5.7,3.8-7.9,11.3-5.2,17.5c2.1,5,6.9,8.4,12.2,8.9c-0.8,3.6-1.8,7.3-3.1,10.8h16c-1.3-3.5-2.3-7.2-3.1-10.8c5.3-0.4,10-3.9,12.2-8.9c2.7-6.2,0.5-13.7-5.2-17.5c-2.7-1.8-5.6-2.3-8.7-1.4c0.7-3.9,1.2-7.9,1.2-12.1c0-4.4-0.2-8.8-0.6-13.2c6.2,0.9,11.9,3.3,16.8,6.9c2,1.5,3.8,3.1,5.4,4.9c9.1,9.9,9.1,26,0,35.8C86.6,74.1,84.8,75.7,82.8,77.2z" fill="#c7d2fe"/>
            <path d="M29.8 24.5c0 0 1.2-10.8 10-10.8" stroke="#c7d2fe" strokeWidth="8" strokeLinecap="round" fill="none" className="llama-ear-animated"/>
            <path d="M70.2 24.5c0 0 -1.2-10.8 -10-10.8" stroke="#c7d2fe" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="65" cy="41.4" r="6" fill="#1e293b"/>
            <circle cx="35" cy="41.4" r="6" fill="#1e293b"/>
            <path d="M57.5,60.7c0,4.1-3.4,7.5-7.5,7.5s-7.5-3.4-7.5-7.5s3.4-7.5,7.5-7.5S57.5,56.6,57.5,60.7z" fill="white"/>
            <path d="M54.3,58.5c-0.8,1.3-2.2,2.1-3.8,2.1c-1.6,0-3-0.8-3.8-2.1c-0.4-0.6-1.2-0.8-1.8-0.4c-0.6,0.4-0.8,1.2-0.4,1.8c1.2,1.8,3.2,2.9,5.4,2.9c2.2,0,4.2-1.1,5.4-2.9c0.4-0.6,0.2-1.4-0.4-1.8C55.5,57.7,54.7,57.9,54.3,58.5z" fill="#1e293b"/>
        </g>
    </svg>
    </>
);

export const LlamaCornerIllustration: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" {...props}>
        <g transform="translate(-20, 0) rotate(15, 50, 100)">
            <path d="M82.8,77.2c-2.4,1.8-5.1,3.3-7.9,4.4c-11.2,4.4-23.7,4.4-34.9,0c-2.8-1.1-5.5-2.6-7.9-4.4c-2-1.5-3.8-3.1-5.4-4.9c-9.1-9.9-9.1-26,0-35.8c1.6-1.8,3.4-3.4,5.4-4.9c4.9-3.6,10.6-6,16.8-6.9" fill="#c7d2fe"/>
            <path d="M29.8 24.5c0 0 1.2-10.8 10-10.8" stroke="#c7d2fe" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <circle cx="35" cy="41.4" r="6" fill="#1e293b"/>
        </g>
    </svg>
);


export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75M4.5 12.75l7.5-7.5 7.5 7.5" />
  </svg>
);

export const LoaderIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l4.992-4.993m-4.993 0l-3.181 3.183a8.25 8.25 0 000 11.664l3.181 3.183" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.47-1.47L12.964 18l1.188-.648a2.25 2.25 0 011.47-1.47L16.25 15l.648 1.188a2.25 2.25 0 011.47 1.47L19.536 18l-1.188.648a2.25 2.25 0 01-1.47 1.47z" />
  </svg>
);

export const ErrorIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const ResetIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-11.664 0l4.992-4.993m-4.993 0l-3.181 3.183a8.25 8.25 0 000 11.664l3.181 3.183" />
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c.065.21.145.421.24.634a7.5 7.5 0 0110.02-6.347 4.5 4.5 0 005.18-4.5 4.5 4.5 0 00-4.5-4.5C9.345 3 6.612 5.11 5.5 7.5c-.255.61-.41 1.253-.496 1.91C4.542 11.25 4.5 11.625 4.5 12s.042.75.104 1.09c.16.84.425 1.644.78 2.388a7.5 7.5 0 0110.02 6.347c.095-.213.175-.424.24-.634z" />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const TargetIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a4.5 4.5 0 11-6.36-6.36 4.5 4.5 0 016.36 6.36z" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const DumbbellIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25H6.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H5.25m13.5-3H17.625c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h.75M9 12h6m-6 4.5h6.375c.621 0 1.125-.504 1.125-1.125V13.5c0-.621-.504-1.125-1.125-1.125H9" />
    </svg>
);

export const ScaleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.38-5.915-.955m-3 .52c-1.01.143-2.01.317-3 .52m3-.52l-2.62 10.726c-.122.499.106 1.028.589 1.202a5.988 5.988 0 002.036.243c2.132 0 4.14-.38 5.915-.955" />
    </svg>
);

export const FireIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 002.25-2.25H12V12.75z" />
    </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const WaterDropIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c4.83.0 8.75-3.92 8.75-8.75S16.83 4.25 12 4.25 3.25 8.17 3.25 13c0 4.83 3.92 8.75 8.75 8.75z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);

export const CheckBadgeIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75" />
    </svg>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-2.087.8-3.642 3.128-3.642 5.77 0 2.642 1.555 4.97 3.642 5.77a2.31 2.31 0 011.64 1.055l.822 1.315a.41.41 0 00.665 0l.822-1.315a2.31 2.31 0 011.64-1.055A4.256 4.256 0 0016.5 12a4.256 4.256 0 00-1.64-3.142 2.31 2.31 0 01-1.64-1.055l-.822-1.315a.41.41 0 00-.665 0l-.822-1.315A2.31 2.31 0 016.827 6.175v0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.267c-.552.039-.994.482-1.034 1.034l-.268 3.722c-.093 1.136-1.057 1.98-2.193 1.98h-4.286c-.97 0-1.813-.616-2.097-1.5l-.268-1.034a1.125 1.125 0 01.11-1.066l.268-.268a1.125 1.125 0 000-1.591l-.268-.268a1.125 1.125 0 01-1.066-.11l-1.034-.268c-.884-.284-1.5-1.128-1.5-2.097v-4.286c0-1.136.847-2.1 1.98-2.193l3.722-.267c.552-.039.994-.482 1.034-1.034l.268-3.722c.093-1.136 1.057-1.98 2.193-1.98h4.286c.97 0 1.813.616 2.097 1.5l.268 1.034a1.125 1.125 0 01-.11 1.066l-.268.268a1.125 1.125 0 000 1.591l.268.268a1.125 1.125 0 011.066.11l1.034.268z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.875 14.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-1.5z" />
    </svg>
);