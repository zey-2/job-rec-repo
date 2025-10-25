
export interface Skill {
  name: string;
  type: 'MATCH' | 'GAP';
}

export interface UpskillingSuggestion {
  area: string;
  suggestion: string;
}

export interface JobRecommendation {
  jobTitle: string;
  matchScore: number;
  summary: string;
  skills: Skill[];
  upskilling: UpskillingSuggestion[];
}

export interface AnalysisResult {
  jobs: JobRecommendation[];
}
