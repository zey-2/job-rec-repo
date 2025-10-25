// index.tsx
import React3 from "react";
import ReactDOM from "react-dom/client";

// App.tsx
import { useState as useState2, useCallback } from "react";

// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
var aiClient = null;
function resolveApiKey() {
  const fromWindow = globalThis?.__GEMINI_API_KEY;
  const fromEnv = globalThis?.process?.env?.API_KEY;
  return fromWindow || fromEnv;
}
function getClient() {
  if (!aiClient) {
    const key = resolveApiKey();
    if (!key) {
      throw new Error(
        "Missing API key. Set window.__GEMINI_API_KEY before analyzing, or provide API_KEY at build time."
      );
    }
    aiClient = new GoogleGenAI({ apiKey: key, vertexai: true });
  }
  return aiClient;
}
var responseSchema = {
  type: Type.OBJECT,
  properties: {
    jobs: {
      type: Type.ARRAY,
      description: "An array of 3 to 5 recommended job roles.",
      items: {
        type: Type.OBJECT,
        properties: {
          jobTitle: {
            type: Type.STRING,
            description: "The title of the recommended job."
          },
          matchScore: {
            type: Type.INTEGER,
            description: "A percentage score (0-100) indicating how well the user profile matches this job."
          },
          summary: {
            type: Type.STRING,
            description: "A brief, 2-3 sentence summary explaining why this job is a good fit."
          },
          skills: {
            type: Type.ARRAY,
            description: "A list of key skills for this job, indicating if they are a match or a gap for the user.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the skill."
                },
                type: {
                  type: Type.STRING,
                  enum: ["MATCH", "GAP"],
                  description: "Indicates if the user has this skill (MATCH) or not (GAP)."
                }
              },
              required: ["name", "type"]
            }
          },
          upskilling: {
            type: Type.ARRAY,
            description: "A list of suggestions for upskilling to close the identified skill gaps.",
            items: {
              type: Type.OBJECT,
              properties: {
                area: {
                  type: Type.STRING,
                  description: "The skill gap this suggestion addresses."
                },
                suggestion: {
                  type: Type.STRING,
                  description: 'A concrete suggestion, like "Take a course in Advanced Python" or "Build a project using AWS Lambda".'
                }
              },
              required: ["area", "suggestion"]
            }
          }
        },
        required: ["jobTitle", "matchScore", "summary", "skills", "upskilling"]
      }
    }
  },
  required: ["jobs"]
};
var analyzeResume = async (resumeText) => {
  const prompt = `
    Analyze the following user profile/resume. Based on the user's skills, experience, and education, perform the following tasks:
    1.  Recommend 3 to 5 highly relevant job roles.
    2.  For each recommended job, provide a "match score" from 0 to 100 representing the quality of the fit.
    3.  For each job, provide a brief summary explaining the recommendation.
    4.  For each job, list the most important skills. For each skill, identify if the user's profile indicates they possess it ('MATCH') or if it's a missing skill ('GAP').
    5.  For each identified skill gap, provide a concrete upskilling suggestion (e.g., "Take an online course in Project Management," "Earn a certification in Google Cloud Platform").

    User Profile:
    ---
    ${resumeText}
    ---
  `;
  try {
    const response = await getClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: "user",
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2
      }
    });
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    if (!result.jobs || !Array.isArray(result.jobs)) {
      throw new Error(
        "Invalid response format from AI: 'jobs' array is missing."
      );
    }
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`AI service error: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred while communicating with the AI service."
    );
  }
};

// components/SkillBadge.tsx
import { Check, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var SkillBadge = ({ skill }) => {
  const isMatch = skill.type === "MATCH";
  const baseClasses = "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full";
  const matchClasses = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  const gapClasses = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  return /* @__PURE__ */ jsxs("div", { className: `${baseClasses} ${isMatch ? matchClasses : gapClasses}`, children: [
    isMatch ? /* @__PURE__ */ jsx(Check, { size: 12 }) : /* @__PURE__ */ jsx(X, { size: 12 }),
    /* @__PURE__ */ jsx("span", { children: skill.name })
  ] });
};
var SkillBadge_default = SkillBadge;

// components/JobCard.tsx
import { Briefcase, Target, GraduationCap, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var JobCard = ({ job }) => {
  const matchedSkills = job.skills.filter((s) => s.type === "MATCH");
  const gapSkills = job.skills.filter((s) => s.type === "GAP");
  const getScoreColor = (score) => {
    if (score >= 75)
      return "text-green-500";
    if (score >= 50)
      return "text-yellow-500";
    return "text-red-500";
  };
  return /* @__PURE__ */ jsx2("article", { className: "bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-all hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600", children: /* @__PURE__ */ jsxs2("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4", children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx2("div", { className: "flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-lg", children: /* @__PURE__ */ jsx2(Briefcase, { className: "w-6 h-6 text-indigo-600 dark:text-indigo-400" }) }),
        /* @__PURE__ */ jsxs2("div", { children: [
          /* @__PURE__ */ jsx2("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: job.jobTitle }),
          /* @__PURE__ */ jsx2("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Recommended Role" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 text-lg font-bold", children: [
        /* @__PURE__ */ jsx2(Target, { className: "w-5 h-5 text-slate-500" }),
        /* @__PURE__ */ jsx2("span", { className: "text-slate-600 dark:text-slate-300", children: "Match Score:" }),
        /* @__PURE__ */ jsxs2("span", { className: getScoreColor(job.matchScore), children: [
          job.matchScore,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx2("p", { className: "text-slate-600 dark:text-slate-300 mb-6", children: job.summary }),
    /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx2(CheckCircle, { className: "w-5 h-5 text-green-500" }),
          /* @__PURE__ */ jsx2("h4", { className: "font-semibold text-slate-700 dark:text-slate-200", children: "Your Strengths" })
        ] }),
        /* @__PURE__ */ jsx2("div", { className: "flex flex-wrap gap-2", children: matchedSkills.length > 0 ? matchedSkills.map((skill) => /* @__PURE__ */ jsx2(SkillBadge_default, { skill }, skill.name)) : /* @__PURE__ */ jsx2("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "No matching skills identified for this role." }) })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsx2(AlertTriangle, { className: "w-5 h-5 text-yellow-500" }),
          /* @__PURE__ */ jsx2("h4", { className: "font-semibold text-slate-700 dark:text-slate-200", children: "Areas for Growth" })
        ] }),
        /* @__PURE__ */ jsx2("div", { className: "flex flex-wrap gap-2", children: gapSkills.length > 0 ? gapSkills.map((skill) => /* @__PURE__ */ jsx2(SkillBadge_default, { skill }, skill.name)) : /* @__PURE__ */ jsx2("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: "Great fit! No major skill gaps found." }) })
      ] })
    ] }),
    job.upskilling.length > 0 && /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsx2(GraduationCap, { className: "w-5 h-5 text-indigo-500" }),
        /* @__PURE__ */ jsx2("h4", { className: "font-semibold text-slate-700 dark:text-slate-200", children: "Recommended Upskilling Path" })
      ] }),
      /* @__PURE__ */ jsx2("ul", { className: "space-y-2", children: job.upskilling.map((item, index) => /* @__PURE__ */ jsxs2("li", { className: "flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md", children: [
        /* @__PURE__ */ jsx2(ArrowRight, { className: "w-4 h-4 mt-1 text-indigo-500 flex-shrink-0" }),
        /* @__PURE__ */ jsxs2("div", { children: [
          /* @__PURE__ */ jsxs2("span", { className: "font-semibold text-slate-800 dark:text-slate-200", children: [
            item.area,
            ":"
          ] }),
          /* @__PURE__ */ jsx2("span", { className: "ml-1 text-slate-600 dark:text-slate-300", children: item.suggestion })
        ] })
      ] }, index)) })
    ] })
  ] }) });
};
var JobCard_default = JobCard;

// components/LoadingState.tsx
import { useState, useEffect } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var LoadingSpinner = () => /* @__PURE__ */ jsxs3(
  "svg",
  {
    className: "animate-spin h-12 w-12 text-indigo-600",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    children: [
      /* @__PURE__ */ jsx3(
        "circle",
        {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4"
        }
      ),
      /* @__PURE__ */ jsx3(
        "path",
        {
          className: "opacity-75",
          fill: "currentColor",
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        }
      )
    ]
  }
);
var loadingMessages = [
  "Analyzing your skills and experience...",
  "Comparing your profile against thousands of job roles...",
  "Identifying your unique strengths...",
  "Pinpointing opportunities for growth...",
  "Building your personalized career plan..."
];
var LoadingState = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs3("div", { className: "flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700", children: [
    /* @__PURE__ */ jsx3(LoadingSpinner, {}),
    /* @__PURE__ */ jsx3("h2", { className: "mt-6 text-xl font-semibold text-slate-800 dark:text-slate-100", children: "Generating Your Analysis" }),
    /* @__PURE__ */ jsx3("p", { className: "mt-2 text-slate-600 dark:text-slate-400 transition-opacity duration-500", children: loadingMessages[messageIndex] })
  ] });
};
var LoadingState_default = LoadingState;

// App.tsx
import { BotMessageSquare, FileText, BrainCircuit } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var App = () => {
  const [resumeText, setResumeText] = useState2("");
  const [analysisResult, setAnalysisResult] = useState2(null);
  const [isLoading, setIsLoading] = useState2(false);
  const [error, setError] = useState2(null);
  const handleAnalysis = useCallback(async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume or profile description first.");
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
      setError("Failed to analyze profile. The AI model may be busy or an error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [resumeText]);
  const handleReset = () => {
    setResumeText("");
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };
  const renderContent = () => {
    if (isLoading) {
      return /* @__PURE__ */ jsx4(LoadingState_default, {});
    }
    if (error) {
      return /* @__PURE__ */ jsxs4("div", { className: "text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: [
        /* @__PURE__ */ jsx4("p", { className: "text-red-600 dark:text-red-400 font-semibold", children: "An Error Occurred" }),
        /* @__PURE__ */ jsx4("p", { className: "text-slate-700 dark:text-slate-300 mt-2", children: error }),
        /* @__PURE__ */ jsx4(
          "button",
          {
            onClick: handleReset,
            className: "mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors",
            children: "Try Again"
          }
        )
      ] });
    }
    if (analysisResult) {
      return /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsx4("h2", { className: "text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100", children: "Your Career Analysis" }),
          /* @__PURE__ */ jsx4(
            "button",
            {
              onClick: handleReset,
              className: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm",
              children: "Start Over"
            }
          )
        ] }),
        /* @__PURE__ */ jsx4("div", { className: "space-y-6", children: analysisResult.jobs.map((job, index) => /* @__PURE__ */ jsx4(JobCard_default, { job }, index)) })
      ] });
    }
    return /* @__PURE__ */ jsxs4("div", { className: "bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx4(FileText, { className: "w-6 h-6 text-indigo-500" }),
        /* @__PURE__ */ jsx4("h2", { className: "text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100", children: "Analyze Your Profile" })
      ] }),
      /* @__PURE__ */ jsx4("p", { className: "text-slate-600 dark:text-slate-400 mb-4", children: "Paste your resume, LinkedIn profile, or a summary of your skills and experience below. Our AI will recommend jobs and identify skill gaps." }),
      /* @__PURE__ */ jsx4(
        "textarea",
        {
          value: resumeText,
          onChange: (e) => setResumeText(e.target.value),
          placeholder: "e.g., John Doe - Software Engineer - 5 years experience in React, Node.js, and AWS...",
          className: "w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-slate-700 dark:text-slate-200",
          "aria-label": "Resume or profile text input"
        }
      ),
      /* @__PURE__ */ jsxs4(
        "button",
        {
          onClick: handleAnalysis,
          disabled: isLoading,
          className: "mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx4(BrainCircuit, { className: "w-5 h-5" }),
            "Analyze & Recommend Jobs"
          ]
        }
      )
    ] });
  };
  return /* @__PURE__ */ jsxs4("div", { className: "min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans", children: [
    /* @__PURE__ */ jsx4("header", { className: "p-4 border-b border-slate-200 dark:border-slate-800", children: /* @__PURE__ */ jsxs4("div", { className: "container mx-auto flex items-center gap-3", children: [
      /* @__PURE__ */ jsx4(BotMessageSquare, { className: "w-8 h-8 text-indigo-500" }),
      /* @__PURE__ */ jsx4("h1", { className: "text-xl md:text-2xl font-bold text-slate-900 dark:text-white", children: "AI Job Recommender" })
    ] }) }),
    /* @__PURE__ */ jsx4("main", { className: "container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl", children: renderContent() }),
    /* @__PURE__ */ jsx4("footer", { className: "text-center p-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 mt-8", children: /* @__PURE__ */ jsx4("p", { children: "Powered by Google Gemini & NTU SCTP DSAI. For educational purposes." }) })
  ] });
};
var App_default = App;

// index.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsx5(React3.StrictMode, { children: /* @__PURE__ */ jsx5(App_default, {}) })
);
