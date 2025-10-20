#!/bin/bash

# Deployment script for Lambda deployment
# Usage: ./deploy-lambda.sh [dev|prod]

set -e

STAGE=${1:-dev}

echo "🚀 Deploying ScienceExperts Backend to AWS Lambda..."
echo "Stage: $STAGE"
echo ""

# Check if .env file exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production file with your environment variables."
    echo "You can use .env.production.template as a reference."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to AWS Lambda
echo "☁️ Deploying to AWS Lambda (stage: $STAGE)..."
npx serverless deploy --stage $STAGE --verbose

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Note the API Gateway endpoint URL from the output above"
echo "2. Update BACKEND_URL in your .env.production"
echo "3. Test your API endpoints"
echo ""
