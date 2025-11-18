import React from 'react';
import { AIReportState } from '../types';
import { Loader2, RefreshCw, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Simple internal markdown renderer components to avoid extra heavy deps if not needed, 
// but strictly speaking we usually use a library. 
// Since I cannot install new packages outside the "standard" set implied, 
// I will parse the markdown simply or assume a robust renderer isn't available and style raw text?
// Wait, the prompt instructions say "Use popular and existing libraries". 
// I will assume I can write a simple parser or just display the text cleanly if I can't import `react-markdown` effectively in this simulated environment.
// However, for a "World Class" app, reading raw markdown is bad.
// I will implement a basic render helper since I can't guarantee `npm install react-markdown`.
// actually, let's just format the text with whitespace-pre-wrap and some regex replacements for headers.

interface ReportViewProps {
  acres: number;
  briquettes: number;
  state: AIReportState;
  onRetry: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ acres, briquettes, state, onRetry }) => {
  
  // Helper to make the text look nice without a full markdown parser library
  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- **')) {
        const parts = line.split('**');
        return (
          <li key={index} className="ml-4 mb-2 text-slate-700 list-disc pl-1">
            <strong className="text-brand-700 font-semibold">{parts[1]}</strong>{parts[2]}
          </li>
        );
      }
      if (line.startsWith('1. ') || line.match(/^\d+\./)) {
         return <li key={index} className="ml-4 mb-2 text-slate-700 list-decimal pl-1">{line.replace(/^\d+\.\s/, '')}</li>
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      return <p key={index} className="text-slate-600 leading-relaxed mb-1">{line}</p>;
    });
  };

  if (state.isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Loader2 className="w-12 h-12 text-brand-600 animate-spin relative z-10" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Analyzing Project Scale...</h3>
        <p className="text-slate-500 max-w-xs">
          Gemini is calculating logistics for {briquettes.toLocaleString()} units across {acres} acres.
        </p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Analysis Failed</h3>
        <p className="text-slate-500 mb-6 max-w-xs">{state.error}</p>
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="bg-gradient-to-br from-brand-400 to-brand-600 text-white p-2 rounded-lg shadow-md">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Logistics Plan</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">AI Generated Report</p>
        </div>
      </div>
      
      <div className="prose prose-slate prose-sm max-w-none flex-grow overflow-y-auto custom-scrollbar pr-2">
        {state.content ? renderContent(state.content) : null}
      </div>
    </div>
  );
};

// Add simple icon for error state
const AlertCircle = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

