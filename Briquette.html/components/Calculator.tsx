import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, AlertCircle } from 'lucide-react';

interface CalculatorProps {
  onCalculate: (acres: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!inputValue) {
        setError(null);
        return;
      }

      const val = parseFloat(inputValue);
      if (isNaN(val) || val <= 0) {
        setError("Please enter a valid positive number.");
        return;
      }
      
      setError(null);
      onCalculate(val);
    }, 400); // Debounce calculation

    return () => clearTimeout(timeoutId);
  }, [inputValue, onCalculate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="w-full">
      <label htmlFor="acres" className="block text-sm font-medium text-slate-700 mb-2">
        Total Acreage
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalcIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="number"
          name="acres"
          id="acres"
          step="0.1"
          min="0"
          className={`block w-full pl-10 pr-12 py-4 sm:text-lg rounded-xl border-2 bg-slate-50 transition-colors focus:bg-white outline-none ${
            error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-slate-200 text-slate-900 focus:border-brand-500 focus:ring-brand-500'
          }`}
          placeholder="e.g. 0.5"
          value={inputValue}
          onChange={handleChange}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="text-slate-500 font-medium sm:text-lg">Acres</span>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 flex items-center gap-1 text-sm text-red-600 animate-fadeIn">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      <p className="mt-3 text-xs text-slate-400">
        Automatically calculates based on 43,560 sq ft per acre.
      </p>
    </div>
  );
};
