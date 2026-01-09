#!/bin/bash

echo "🚀 Building Backend..."

# Install dependencies
pip install -r requirements.txt

# Run migrations
python3 manage.py migrate

# Collect static files
python3 manage.py collectstatic --noinput

echo "✅ Backend Build Complete"
