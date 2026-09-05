import React from 'react';

export const BrandLogo = ({ size = 'md', showTagline = false, className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-xs' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-xs' },
  }[size] || { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-xs' };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Refined Minimalist Healthcare Progress Mark */}
      <div
        className={`${sizeMap.icon} rounded-xl bg-teal-700 dark:bg-teal-600 text-white flex items-center justify-center p-1.5 shadow-sm flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Progressive queue arcs */}
          <path
            d="M 4 12 A 8 8 0 0 1 12 4"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 12 20 A 8 8 0 0 0 20 12"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Central care pulse dot */}
          <circle cx="12" cy="12" r="2.5" fill="white" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-bold tracking-tight text-slate-900 dark:text-slate-100 ${sizeMap.text} leading-none`}
        >
          Medi<span className="text-teal-700 dark:text-teal-400">Queue</span>
        </span>
        {showTagline && (
          <span
            className={`font-medium text-slate-500 dark:text-slate-400 ${sizeMap.sub} mt-0.5 tracking-tight`}
          >
            Arrive when it's your turn.
          </span>
        )}
      </div>
    </div>
  );
};
