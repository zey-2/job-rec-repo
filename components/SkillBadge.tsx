
import React from 'react';
import type { Skill } from '../types';
import { Check, X } from 'lucide-react';

interface SkillBadgeProps {
  skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  const isMatch = skill.type === 'MATCH';

  const baseClasses = "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full";
  const matchClasses = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  const gapClasses = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";

  return (
    <div className={`${baseClasses} ${isMatch ? matchClasses : gapClasses}`}>
      {isMatch ? <Check size={12} /> : <X size={12} />}
      <span>{skill.name}</span>
    </div>
  );
};

export default SkillBadge;
