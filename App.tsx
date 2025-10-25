
import React, { useState, useCallback } from 'react';
import { analyzeResume } from './services/geminiService';
import type { AnalysisResult } from './types';
import JobCard from './components/JobCard';
import LoadingState from './components/LoadingState';
import { BotMessageSquare, FileText, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume or profile description first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeText);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze profile. The AI model may be busy or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText]);

  const handleReset = () => {
    setResumeText('');
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-semibold">An Error Occurred</p>
          <p className="text-slate-700 dark:text-slate-300 mt-2">{error}</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (analysisResult) {
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Your Career Analysis</h2>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Start Over
            </button>
          </div>
          <div className="space-y-6">
            {analysisResult.jobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-indigo-500" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Analyze Your Profile</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Paste your resume, LinkedIn profile, or a summary of your skills and experience below. Our AI will recommend jobs and identify skill gaps.
        </p>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="e.g., John Doe - Software Engineer - 5 years experience in React, Node.js, and AWS..."
          className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-700 dark:text-slate-200"
          aria-label="Resume or profile text input"
        />
        <button
          onClick={handleAnalysis}
          disabled={isLoading}
          className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200"
        >
          <BrainCircuit className="w-5 h-5" />
          Analyze & Recommend Jobs
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex items-center gap-3">
          <BotMessageSquare className="w-8 h-8 text-indigo-500" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            AI Job Recommender
          </h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-8">
        <p>Powered by Google Gemini & NTU SCTP DSAI. For educational purposes.</p>
      </footer>
    </div>
  );
};

export default App;
