# CineAI - AI-Powered Movie Discovery Platform

🎬 **AI in Action Hackathon 2024** 🏆

CineAI is an intelligent movie discovery platform that leverages Google Cloud AI services to provide semantic movie search, multi-language support, and AI-generated insights.

## 🌟 Features

- **Semantic Search**: Search movies using natural language (e.g., "funny movies about friendship in the 90s")
- **AI-Powered Recommendations**: Get personalized movie suggestions based on vector similarity
- **Smart Movie Insights**: AI-generated explanations of why you might enjoy specific movies
- **Mood-Based Discovery**: Find movies based on your current mood
- **Beautiful UI**: Modern, responsive design with smooth animations

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas with Vector Search
- **AI**: OpenAI GPT-3.5 Turbo & Text Embeddings
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ or pnpm
- MongoDB Atlas account
- OpenAI API key

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd cineai
pnpm install
```

### 2. Set up MongoDB Atlas

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Load the sample Mflix dataset:
   - Go to your cluster dashboard
   - Click "Browse Collections"
   - Click "Add My Own Data" or "Load Sample Dataset"
   - Select the "sample_mflix" database
4. Create a Vector Search Index:
   - Go to Atlas Search
   - Create a new Search Index
   - Choose "Vector Search"
   - Select the `sample_mflix.embedded_movies` collection
   - Use this configuration:
   ```json
   {
     "fields": [
       {
         "numDimensions": 1536,
         "path": "plot_embedding",
         "similarity": "cosine",
         "type": "vector"
       }
     ]
   }
   ```
   - Name the index: `PlotSemanticSearch`

### 3. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key for the next step

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sample_mflix?retryWrites=true&w=majority

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
```

Replace:
- `username:password@cluster` with your MongoDB Atlas credentials
- `your-openai-api-key-here` with your OpenAI API key

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
