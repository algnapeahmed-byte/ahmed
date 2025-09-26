
import React from 'react';

interface BackgroundOption {
  id: string;
  label: string;
  promptValue: string;
}

interface BackgroundSelectorProps {
  options: BackgroundOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ options, selectedValue, onChange }) => {
  return (
    <div className="w-full max-w-4xl mb-8">
      <h3 className="text-xl font-semibold text-center mb-4 text-indigo-300">اختر الخلفية</h3>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
              selectedValue === option.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
