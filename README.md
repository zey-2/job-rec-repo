# AI Job Recommender & Skill Gap Analysis

An AI-driven system that analyzes user profiles to recommend optimal job roles, identifies skill gaps for each role, and suggests personalized upskilling paths using Google Gemini AI.

## Features

- **AI-Powered Analysis**: Uses Google Gemini 2.5-flash to analyze resumes and profiles
- **Job Recommendations**: Provides 3-5 relevant job role suggestions with match scores (0-100)
- **Skill Gap Analysis**: Identifies existing skills (MATCH) vs. missing skills (GAP)
- **Upskilling Suggestions**: Offers concrete recommendations for closing skill gaps
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark/light mode based on system preferences
- **Real-time Feedback**: Animated loading states with progress messages

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google Cloud Vertex AI API key with Gemini access
- Internet connection for AI API calls

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Vertex_Build_Job
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or set environment variables in your system):

```bash
# Required: Google Vertex AI API Key
API_KEY=your_google_vertex_ai_api_key_here
```

**Getting a Google Vertex AI API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Vertex AI API
4. Create credentials (API Key)
5. Copy the API key to your `.env` file

### 3. Run the Application

Since this project uses CDN imports and runs directly in the browser, you can serve it using any static file server:

#### Option A: Using Python (if installed)

```bash
python -m http.server 8000
```

#### Option B: Using Node.js (if installed)

```bash
npx serve .
```

#### Option C: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

#### Option D: Direct File Opening

Simply open `index.html` in your web browser. Note: Some browsers may restrict direct file access to APIs.

### 4. Access the Application

Open your browser and navigate to:

- `http://localhost:8000` (if using Python/Node server)
- Or the URL provided by your static server

## Usage

1. **Input Your Profile**: Paste your resume, LinkedIn profile, or a summary of your skills and experience in the text area
2. **Analyze**: Click the "Analyze & Recommend Jobs" button
3. **Review Results**: View job recommendations with:
   - Match scores indicating fit quality
   - Your existing skills (green badges)
   - Skill gaps to address (yellow badges)
   - Personalized upskilling suggestions

## Architecture

### Core Components

- **`App.tsx`**: Main application component managing state and user flow
- **`services/geminiService.ts`**: AI service integration with structured JSON responses
- **`components/JobCard.tsx`**: Displays individual job recommendations
- **`components/SkillBadge.tsx`**: Shows skill match/gap indicators
- **`components/LoadingState.tsx`**: Animated loading component
- **`types.ts`**: TypeScript interfaces for type safety

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **AI**: Google Gemini 2.5-flash via Vertex AI
- **Runtime**: Browser-native (no build system)

### Data Flow

1. User submits profile text
2. Text sent to Gemini AI with structured prompt
3. AI returns JSON with job recommendations, skills analysis, and upskilling suggestions
4. Results rendered in responsive UI components

## Development

This project uses a unique CDN-based approach with no build system:

- Dependencies loaded via ESM.sh CDN
- TypeScript compiled in-browser
- No package.json or build configuration needed
- Direct file serving for development

### Adding New Features

1. Update TypeScript interfaces in `types.ts`
2. Modify AI prompt and schema in `services/geminiService.ts`
3. Add UI components following existing patterns
4. Test with sample resume data

## Contributing

This is an educational project for NTU SCTP DSAI. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with various resume inputs
5. Submit a pull request

## License

Educational project - see footer attribution in the application.

## Troubleshooting

### Common Issues

**"API_KEY environment variable not set"**

- Ensure your `.env` file exists and contains `API_KEY=your_key_here`
- If running from file system, set the environment variable in your system settings

**"Failed to analyze profile"**

- Check your internet connection
- Verify your Google Vertex AI API key is valid and has Gemini access
- Ensure you haven't exceeded API quotas

**Browser console errors**

- Modern browsers required (ES6 modules support)
- CORS issues may occur with direct file opening - use a local server instead

## Acknowledgments

- Powered by Google Gemini AI
- Built for NTU SCTP DSAI program
- Icons by Lucide React
- Styling with Tailwind CSS
