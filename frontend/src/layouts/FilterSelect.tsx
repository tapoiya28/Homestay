import React from 'react';

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: string }[];
    defaultLabel: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ options, defaultLabel, className = "", ...props }) => {
    return (
        <div className="relative">
            <select
                className={`appearance-none border border-DarkOutline rounded-full pl-4 pr-10 py-1.5 be-vietnam-pro-light text-size-small text-DarkOutline focus:outline-none focus:border-tirtiary transition-colors cursor-pointer hover:bg-white bg-background ${className}`}
                {...props}
            >
                <option value="" disabled selected hidden>{defaultLabel}</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-DarkOutline opacity-70">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};

export default FilterSelect;
