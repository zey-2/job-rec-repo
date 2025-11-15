# Generation Prompt for AI Job Recommender & Skill Gap Analysis

This document contains the comprehensive prompt that can be used to regenerate this application from scratch.

---

## Prompt to Generate This Application

Create an **AI-driven Job Recommender and Skill Gap Analysis system** that helps users discover relevant career opportunities and personalized upskilling paths. The application should analyze user profiles (resumes, LinkedIn profiles, or skill summaries) using Google Gemini AI to provide intelligent job recommendations with skill gap analysis.

### Core Requirements

#### 1. Application Overview
- **Purpose**: Analyze user profiles to recommend optimal job roles, identify skill gaps, and suggest personalized upskilling paths
- **AI Integration**: Use Google Gemini 2.5-flash via Vertex AI with structured JSON responses
- **User Experience**: Clean, responsive, dark-mode-enabled interface with real-time feedback
- **Deployment**: Support both local development and cloud deployment (Google Cloud Run)

#### 2. Technical Stack & Architecture

**Frontend:**
- React 18 with TypeScript (TSX files)
- CDN-based approach using ESM.sh (no build system required)
- Tailwind CSS via CDN for styling
- Lucide React for icons
- Browser-native execution with ES6 modules

**Backend/Server:**
- Python HTTP server with proper MIME types for ES6 modules
- Environment variable support via `.env` file
- API key injection into HTML for secure configuration
- Cloud Run compatibility (PORT environment variable support)

**AI Integration:**
- Google Gemini AI (@google/genai package)
- Vertex AI enabled
- Structured JSON response schema
- Temperature: 0.2 for consistent outputs

**Deployment:**
- Dockerfile for containerization
- Google Cloud Run deployment support
- Artifact Registry integration

#### 3. Core Features to Implement

**Feature 1: Profile Input & Analysis**
- Large text area for user to paste resume, LinkedIn profile, or skill summary
- "Analyze & Recommend Jobs" button with loading state
- Error handling with user-friendly messages
- Input validation (non-empty check)

**Feature 2: AI-Powered Job Recommendations**
- Request 3-5 relevant job roles based on user profile
- Each recommendation includes:
  - Job title
  - Match score (0-100 percentage)
  - Brief 2-3 sentence summary explaining the fit
  - List of required skills categorized as MATCH (user has) or GAP (user lacks)
  - Concrete upskilling suggestions for each skill gap

**Feature 3: Visual Presentation**
- Job cards with:
  - Match score with color coding (green ≥75%, yellow ≥50%, red <50%)
  - Two-column layout for matched skills vs. skill gaps
  - Skill badges with icons (checkmark for MATCH, X for GAP)
  - Upskilling suggestions with clear action items
- Responsive design (mobile and desktop)
- Dark mode support based on system preferences

**Feature 4: Loading & Feedback States**
- Animated loading spinner
- Rotating progress messages:
  - "Analyzing your skills and experience..."
  - "Comparing your profile against thousands of job roles..."
  - "Identifying your unique strengths..."
  - "Pinpointing opportunities for growth..."
  - "Building your personalized career plan..."
- Messages change every 2.5 seconds

**Feature 5: API Key Management**
- Support for `.env` file configuration (GEMINI_API_KEY)
- Browser localStorage fallback
- Server-side injection into HTML
- Clear setup instructions in documentation

#### 4. File Structure & Components

**Main Application Files:**
```
├── index.html              # Entry point with importmap for ESM CDN
├── index.js                # Compiled JS bundle (from index.tsx)
├── index.tsx               # React app initialization
├── App.tsx                 # Main application component
├── server.py               # Python development server with .env support
├── Dockerfile              # Container configuration for Cloud Run
├── .env.example            # Example environment configuration
├── .gitignore              # Git ignore file (includes .env)
├── README.md               # Comprehensive documentation
├── metadata.json           # Project metadata
└── global.d.ts             # TypeScript global declarations
```

**TypeScript Types (types.ts):**
```typescript
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
```

**Components to Create:**

1. **App.tsx** - Main component with state management:
   - State: resumeText, analysisResult, isLoading, error
   - Methods: handleAnalysis(), handleReset()
   - Layout: Header with branding, main content area, footer with attribution

2. **components/JobCard.tsx** - Individual job recommendation display:
   - Props: JobRecommendation object
   - Sections: Title with match score, summary, matched skills, skill gaps, upskilling suggestions
   - Color-coded match score
   - Responsive grid layout
   - Icons: Briefcase, Target, CheckCircle, AlertTriangle, GraduationCap, ArrowRight

3. **components/SkillBadge.tsx** - Skill display with type indicator:
   - Props: Skill object
   - Styling: Pill-shaped badges with icon
   - Colors: Green for MATCH, Yellow for GAP
   - Dark mode variants

4. **components/LoadingState.tsx** - Animated loading component:
   - Spinning SVG loader
   - Rotating messages array
   - useEffect hook for message cycling

**Services:**

5. **services/geminiService.ts** - AI integration layer:
   - Function: analyzeResume(resumeText: string): Promise<AnalysisResult>
   - API key resolution: window.__GEMINI_API_KEY → process.env.API_KEY → localStorage
   - Lazy client initialization
   - Structured response schema definition
   - Error handling with informative messages
   - Model: gemini-2.5-flash
   - Config: responseMimeType="application/json", temperature=0.2

**AI Prompt Template:**
```
Analyze the following user profile/resume. Based on the user's skills, experience, and education, perform the following tasks:
1. Recommend 3 to 5 highly relevant job roles.
2. For each recommended job, provide a "match score" from 0 to 100 representing the quality of the fit.
3. For each job, provide a brief summary explaining the recommendation.
4. For each job, list the most important skills. For each skill, identify if the user's profile indicates they possess it ('MATCH') or if it's a missing skill ('GAP').
5. For each identified skill gap, provide a concrete upskilling suggestion (e.g., "Take an online course in Project Management," "Earn a certification in Google Cloud Platform").

User Profile:
---
${resumeText}
---
```

**Response Schema:**
- Type: OBJECT
- Properties:
  - jobs: ARRAY of job objects
    - jobTitle: STRING
    - matchScore: INTEGER (0-100)
    - summary: STRING
    - skills: ARRAY of skill objects
      - name: STRING
      - type: ENUM ["MATCH", "GAP"]
    - upskilling: ARRAY of suggestion objects
      - area: STRING
      - suggestion: STRING

#### 5. Configuration Files

**index.html:**
- DOCTYPE html with proper meta tags
- Tailwind CSS CDN script
- Import map for ESM dependencies:
  - react@18.3.1
  - react-dom@18.3.1/client
  - @google/genai@1.20.0
  - lucide-react@0.417.0
- Script to load API key from localStorage or window global
- Root div for React mounting
- Module script loading index.js

**server.py:**
- Python HTTP server with custom request handler
- Load .env file and environment variables
- Port selection: PORT env → CLI arg → 8000 default
- Proper MIME types for .js, .mjs, .json, .css, .html
- Inject GEMINI_API_KEY into index.html on GET requests
- Cloud Run compatible

**Dockerfile:**
- Multi-stage build approach (if needed)
- Python 3.11+ base image
- Copy all application files
- Expose PORT environment variable
- CMD: python server.py with PORT binding

**.env.example:**
```
GEMINI_API_KEY=your-api-key-here
```

**.gitignore:**
```
.env
node_modules/
.DS_Store
*.log
dist/
build/
.vscode/
.idea/
```

**global.d.ts:**
- TypeScript declarations for window.__GEMINI_API_KEY
- Module declarations for CDN imports if needed

**metadata.json:**
```json
{
  "name": "AI Job Recommender & Skill Gap Analysis",
  "description": "An AI-driven system that learns from a user's profile to recommend optimal job roles, identifies skill gaps for each role, and suggests personalized upskilling paths."
}
```

#### 6. Styling & Design Requirements

**Color Scheme:**
- Primary: Indigo (indigo-500, indigo-600, indigo-700)
- Success/Match: Green (green-100, green-500, green-800)
- Warning/Gap: Yellow (yellow-100, yellow-500, yellow-800)
- Error: Red (red-50, red-400, red-600)
- Neutral: Slate shades for text and backgrounds

**Dark Mode:**
- Use Tailwind's `dark:` prefix for all color classes
- Automatic detection via system preferences
- Dark backgrounds: slate-900, slate-800, slate-700
- Dark text: slate-100, slate-200, slate-300

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm, md, lg (Tailwind defaults)
- Flexible grid layouts
- Stack columns on mobile, side-by-side on desktop

**Component Styling:**
- Rounded corners (rounded-lg, rounded-xl)
- Subtle shadows (shadow-md, shadow-lg)
- Border colors with dark variants
- Hover states with transitions
- Loading animations (animate-spin)

#### 7. Documentation Requirements

Create a comprehensive **README.md** with:

**Sections:**
1. **Project Title & Description**
   - One-line tagline
   - Feature list with emojis/bullets

2. **Features**
   - AI-Powered Analysis
   - Job Recommendations with match scores
   - Skill Gap Analysis (MATCH vs GAP)
   - Upskilling Suggestions
   - Responsive Design
   - Dark Mode Support
   - Real-time Feedback

3. **Prerequisites**
   - Modern web browser
   - Google Cloud Vertex AI API key
   - Internet connection

4. **Setup Instructions**
   - Clone repository
   - Configure API key (detailed steps for Google Cloud Console)
   - Create .env file
   - Alternative: localStorage method
   - Run the application (python server.py)
   - Access via http://localhost:8000

5. **Google Cloud Run Deployment** (Optional)
   - Prerequisites (billing, gcloud SDK, APIs enabled)
   - Build and push Docker image
   - Deploy with environment variables
   - Security notes (Secret Manager recommendation)

6. **Usage**
   - Step-by-step user flow
   - What to input
   - How to interpret results

7. **Architecture**
   - Core Components overview
   - Technology Stack list
   - Data Flow diagram/description

8. **Development**
   - Project Structure explanation
   - Adding New Features guide
   - CDN-based approach benefits

9. **Troubleshooting**
   - Common issues and solutions
   - API key errors
   - Connection problems
   - Browser compatibility

10. **Acknowledgments**
    - Powered by Google Gemini AI
    - Built for NTU SCTP DSAI program
    - Icon and styling library credits

#### 8. Implementation Guidelines

**Code Quality:**
- Use TypeScript for type safety
- Functional React components with hooks
- Clear prop interfaces
- Descriptive variable and function names
- Comments only where logic is complex
- Error boundaries for robust error handling

**Best Practices:**
- Lazy initialization of AI client
- Secure API key handling (never hardcode in client code)
- Proper MIME types for ES6 modules
- CORS-friendly development server
- Responsive and accessible UI
- Loading states for all async operations
- User-friendly error messages

**Security:**
- .env file in .gitignore
- API key injection server-side when possible
- No credentials in source code
- Environment variable validation
- HTTPS for production deployments

**Performance:**
- CDN-based dependencies for fast loading
- Minimal JavaScript bundle
- No build system overhead
- Efficient state management
- Optimized re-renders with useCallback

#### 9. Testing & Validation

**Manual Testing Checklist:**
- [ ] Input validation works (empty text warning)
- [ ] AI analysis completes successfully with sample resume
- [ ] Loading states display with rotating messages
- [ ] Job cards render with all sections
- [ ] Match scores display with correct colors
- [ ] Skill badges show correct type (MATCH/GAP)
- [ ] Upskilling suggestions are visible and formatted
- [ ] Start Over button resets state
- [ ] Dark mode toggles correctly
- [ ] Responsive layout works on mobile and desktop
- [ ] Error handling displays appropriate messages
- [ ] API key configuration works via .env and localStorage

**Sample Resume for Testing:**
```
John Doe
Software Engineer with 5 years of experience

Skills:
- React, JavaScript, HTML, CSS
- Node.js, Express
- Git, GitHub
- Agile methodology

Experience:
- Frontend Developer at Tech Corp (3 years)
- Built responsive web applications
- Collaborated with design team

Education:
- Bachelor's in Computer Science

Looking to transition into Full Stack or Cloud roles.
```

#### 10. Additional Features (Optional Enhancements)

Consider these for future iterations:
- Export results to PDF
- Save analysis history
- Share results via link
- Compare multiple job recommendations
- Integration with job boards
- Resume parsing from uploaded files
- Multi-language support
- Analytics dashboard
- User authentication for saved profiles

---

## Implementation Steps

1. **Set up project structure** - Create all directories and placeholder files
2. **Configure index.html** - Set up importmap and CDN dependencies
3. **Create TypeScript types** - Define all interfaces in types.ts
4. **Implement Gemini service** - Build AI integration with proper schema
5. **Build React components** - Create all UI components (App, JobCard, SkillBadge, LoadingState)
6. **Create development server** - Implement server.py with .env support
7. **Add styling** - Apply Tailwind classes for responsive, dark-mode design
8. **Write documentation** - Create comprehensive README.md
9. **Add deployment config** - Create Dockerfile for Cloud Run
10. **Test thoroughly** - Validate all features with real API calls
11. **Create .env.example** - Provide template for configuration

---

## Expected Outcome

A fully functional, production-ready web application that:
- Analyzes user profiles using Google Gemini AI
- Provides 3-5 relevant job recommendations
- Identifies skill matches and gaps
- Suggests concrete upskilling actions
- Works seamlessly on desktop and mobile
- Supports dark mode
- Can be deployed locally or to Google Cloud Run
- Includes comprehensive documentation for setup and usage

The application should be simple to set up (no build system), easy to use (single-page interface), and provide valuable career guidance through AI-powered analysis.
