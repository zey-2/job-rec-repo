
import React from 'react';
import type { JobRecommendation } from '../types';
import SkillBadge from './SkillBadge';
import { Briefcase, Target, GraduationCap, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface JobCardProps {
  job: JobRecommendation;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const matchedSkills = job.skills.filter(s => s.type === 'MATCH');
  const gapSkills = job.skills.filter(s => s.type === 'GAP');

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{job.jobTitle}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recommended Role</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <Target className="w-5 h-5 text-slate-500" />
            <span className="text-slate-600 dark:text-slate-300">Match Score:</span>
            <span className={getScoreColor(job.matchScore)}>{job.matchScore}%</span>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-6">{job.summary}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Matched Skills */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-200">Your Strengths</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchedSkills.length > 0 ? (
                matchedSkills.map(skill => <SkillBadge key={skill.name} skill={skill} />)
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">No matching skills identified for this role.</p>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-200">Areas for Growth</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {gapSkills.length > 0 ? (
                gapSkills.map(skill => <SkillBadge key={skill.name} skill={skill} />)
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Great fit! No major skill gaps found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Upskilling Suggestions */}
        {job.upskilling.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              <h4 className="font-semibold text-slate-700 dark:text-slate-200">Recommended Upskilling Path</h4>
            </div>
            <ul className="space-y-2">
              {job.upskilling.map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                  <ArrowRight className="w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.area}:</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-300">{item.suggestion}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

export default JobCard;
