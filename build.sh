#!/bin/bash
# Build script for AI Job Recommender
# Rebuilds the index.js bundle from TypeScript source files using esbuild

echo "🔨 Building AI Job Recommender..."

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js first."
    exit 1
fi

# Backup old bundle
if [ -f "index.js" ]; then
    echo "📦 Backing up old bundle..."
    cp index.js index.js.backup
fi

# Build with esbuild
echo "⚡ Running esbuild..."
npx esbuild index.tsx \
    --bundle \
    --format=esm \
    --outfile=index.js \
    --external:react \
    --external:react-dom/client \
    --external:@google/genai \
    --external:lucide-react \
    --jsx=automatic

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    size=$(du -h index.js | cut -f1)
    echo "📊 Bundle size: $size"
    
    # Clean up backup
    [ -f "index.js.backup" ] && rm index.js.backup
else
    echo "❌ Build failed!"
    
    # Restore backup if build failed
    if [ -f "index.js.backup" ]; then
        echo "🔄 Restoring previous bundle..."
        mv index.js.backup index.js
    fi
    exit 1
fi

echo ""
echo "🚀 Ready to serve! Run: python server.py 8000"
