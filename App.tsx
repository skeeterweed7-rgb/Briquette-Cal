import React, { useState, useCallback } from 'react';
import { Calculator } from './components/Calculator';
import { ReportView } from './components/ReportView';
import { generateLogisticsReport } from './services/gemini';
import { CalculationData, AIReportState } from './types';
import { Leaf, Map, Box, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<CalculationData | null>(null);
  const [reportState, setReportState] = useState<AIReportState>({
    isLoading: false,
    content: null,
    error: null,
  });

  // Constant: 1 Acre = 43,560 sq ft
  const SQ_FT_PER_ACRE = 43560;
  const COVERAGE_PER_BRIQUETTE = 100;

  const handleCalculate = useCallback((acres: number) => {
    const totalSqFt = acres * SQ_FT_PER_ACRE;
    const briquettesNeeded = Math.ceil(totalSqFt / COVERAGE_PER_BRIQUETTE);

    const newData: CalculationData = {
      acres,
      sqFt: totalSqFt,
      briquettes: briquettesNeeded,
    };
    setData(newData);
    
    // Reset report when input changes significantly
    setReportState({ isLoading: false, content: null, error: null });
  }, []);

  const fetchAIReport = useCallback(async () => {
    if (!data) return;

    setReportState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const report = await generateLogisticsReport(data.acres, data.briquettes);
      setReportState({ isLoading: false, content: report, error: null });
    } catch (err) {
      setReportState({ 
        isLoading: false, 
        content: null, 
        error: "Failed to generate insights. Please check your API key configuration." 
      });
    }
  }, [data]);

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Briquette
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
            Briquette Estimation Utility
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-12 px-4 sm:px-6">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Calculator */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Map className="text-brand-500" size={20} />
                Property Details
              </h2>
              <Calculator onCalculate={handleCalculate} />
            </div>

            {/* Summary Card */}
            {data && (
              <div className="bg-brand-900 text-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-700 rounded-full opacity-50 blur-2xl"></div>
                <div className="relative z-10">
                  <p className="text-brand-200 text-sm font-medium uppercase tracking-wider mb-1">Total Required</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold tracking-tighter">
                      {data.briquettes.toLocaleString()}
                    </span>
                    <span className="text-brand-100 font-medium">briquettes</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-brand-700 pt-4">
                    <div>
                      <p className="text-brand-300 text-xs uppercase">Total Area</p>
                      <p className="text-lg font-semibold">{data.sqFt.toLocaleString()} sq ft</p>
                    </div>
                    <div>
                      <p className="text-brand-300 text-xs uppercase">Coverage Rate</p>
                      <p className="text-lg font-semibold">1 per 100 sq ft</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Report & Visualization */}
          <div className="lg:col-span-7 flex flex-col h-full">
             {data ? (
               <div className="flex flex-col gap-6 h-full">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-grow p-6 sm:p-8 relative min-h-[400px]">
                    {!reportState.content && !reportState.isLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
                          <Box size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready for Analysis</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">
                          Get a detailed logistics plan, including weight estimates, application time, and pro tips generated by Gemini AI.
                        </p>
                        <button 
                          onClick={fetchAIReport}
                          className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          Generate Logistics Plan
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}

                    {(reportState.isLoading || reportState.content || reportState.error) && (
                      <ReportView 
                        acres={data.acres} 
                        briquettes={data.briquettes}
                        state={reportState} 
                        onRetry={fetchAIReport}
                      />
                    )}
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                 <Map size={48} className="mb-4 opacity-50" />
                 <p className="text-lg font-medium">Enter acreage to begin</p>
                 <p className="text-sm">Your results and AI insights will appear here</p>
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;