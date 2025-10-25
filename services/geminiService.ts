import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from "../types";

// Lazily initialize the AI client at runtime to avoid crashing on import in the browser
let aiClient: GoogleGenAI | null = null;

function resolveApiKey(): string | undefined {
  // Prefer a browser-safe injection point to avoid exposing secrets in code
  // You can set window.__GEMINI_API_KEY in the dev console or via an inline script tag
  const fromWindow = (globalThis as any)?.__GEMINI_API_KEY as
    | string
    | undefined;
  // Fallbacks for environments that define process.env at build time
  // Note: in a pure browser without bundling, process/env are undefined
  const fromEnv = (globalThis as any)?.process?.env?.API_KEY as
    | string
    | undefined;
  return fromWindow || fromEnv;
}

function getClient(): GoogleGenAI {
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

const responseSchema = {
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
            description: "The title of the recommended job.",
          },
          matchScore: {
            type: Type.INTEGER,
            description:
              "A percentage score (0-100) indicating how well the user profile matches this job.",
          },
          summary: {
            type: Type.STRING,
            description:
              "A brief, 2-3 sentence summary explaining why this job is a good fit.",
          },
          skills: {
            type: Type.ARRAY,
            description:
              "A list of key skills for this job, indicating if they are a match or a gap for the user.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the skill.",
                },
                type: {
                  type: Type.STRING,
                  enum: ["MATCH", "GAP"],
                  description:
                    "Indicates if the user has this skill (MATCH) or not (GAP).",
                },
              },
              required: ["name", "type"],
            },
          },
          upskilling: {
            type: Type.ARRAY,
            description:
              "A list of suggestions for upskilling to close the identified skill gaps.",
            items: {
              type: Type.OBJECT,
              properties: {
                area: {
                  type: Type.STRING,
                  description: "The skill gap this suggestion addresses.",
                },
                suggestion: {
                  type: Type.STRING,
                  description:
                    'A concrete suggestion, like "Take a course in Advanced Python" or "Build a project using AWS Lambda".',
                },
              },
              required: ["area", "suggestion"],
            },
          },
        },
        required: ["jobTitle", "matchScore", "summary", "skills", "upskilling"],
      },
    },
  },
  required: ["jobs"],
};

export const analyzeResume = async (
  resumeText: string
): Promise<AnalysisResult> => {
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
        parts: [{ text: prompt }],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation
    if (!result.jobs || !Array.isArray(result.jobs)) {
      throw new Error(
        "Invalid response format from AI: 'jobs' array is missing."
      );
    }

    return result as AnalysisResult;
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
