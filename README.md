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

### 2. Configure API Key

**Getting a Google Vertex AI API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Vertex AI API
4. Create credentials (API Key)
5. Copy your API key

**Setting the API Key:**

Create a `.env` file in the project root directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and replace the placeholder with your actual API key:

```
GEMINI_API_KEY=your-actual-api-key-here
```

**Note:** The `.env` file is already in `.gitignore` to prevent accidentally committing your API key to version control.

**Alternative (Browser-only):**

If you prefer, you can still set the API key in the browser's localStorage:

1. Open the application in your browser (`http://localhost:8000`)
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Run this command (replace with your actual API key):

```javascript
localStorage.setItem("GEMINI_API_KEY", "your-actual-api-key-here");
```

5. Refresh the page (`F5`)

### 3. Run the Application

Start the Python server:

```bash
python server.py
```

The server will start on port 8000 by default. You can specify a different port:

```bash
python server.py 3000
```

**Note:** We use a custom server script (`server.py`) that properly handles ES6 modules and automatically injects your API key from the `.env` file.

#### Deploy to Google Cloud Run (optional)

You can deploy this app as a serverless container on Google Cloud Run.

Prerequisites:

- Google Cloud project with billing enabled
- Google Cloud SDK installed and authenticated (`gcloud init`)
- Artifact Registry API and Cloud Run API enabled

Build and push the container image (uses the provided `Dockerfile`):

```powershell
# Enable required APIs
gcloud services enable cloudbuild.googleapis.com artifactregistry.googleapis.com

# Set variables (edit the REGION and REPO to your preference)
$PROJECT_ID = (gcloud config get-value project)
$REGION = "us-central1"
$REPO = "job-rec-repo"

# Create Artifact Registry repository (one-time)
gcloud artifacts repositories create $REPO --repository-format=docker --location=$REGION --description="Images for AI Job Recommender" 2>$null

# Build and push image with Cloud Build
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/ai-job-recommender:latest"
```

Deploy to Cloud Run and set the API key:

```powershell
# Deploy (publicly accessible)
gcloud run deploy ai-job-recommender `
   --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/ai-job-recommender:latest" `
   --platform managed `
   --region $REGION `
   --allow-unauthenticated `
   --set-env-vars GEMINI_API_KEY="your-actual-api-key-here"

# Get the service URL
gcloud run services describe ai-job-recommender --region $REGION --format='value(status.url)'
```

Notes:

- The server reads the Cloud Run `$PORT` environment variable automatically (no extra configuration needed).
- For better security, store the API key in Secret Manager and mount or inject it at deploy time instead of using `--set-env-vars`.
- To update, rebuild and redeploy the image; Cloud Run will roll traffic automatically.

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

**Note:** The AI prompts reside in `services/geminiService.ts`.

## Development

### Project Structure

This project uses a CDN-based approach with no build system required:

- Dependencies loaded via ESM.sh CDN (React, Tailwind, etc.)
- All code runs directly in the browser
- Simple Python server for development

### Adding New Features

1. Update TypeScript interfaces in `types.ts`
2. Modify AI prompt and schema in `services/geminiService.ts`
3. Add UI components following existing patterns
4. Test with sample resume data
5. Refresh browser to see changes

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

**"Missing API key" error**

- Make sure you've created a `.env` file with your `GEMINI_API_KEY`
- Or open browser console (`F12`) and run: `localStorage.setItem('GEMINI_API_KEY', 'your-key-here');`
- Then refresh the page

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
