#!/usr/bin/env python3
"""
FinSage Backend Startup Script
Simple script to start the FinSage backend application.
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_directories():
    """Create necessary directories if they don't exist."""
    directories = ["logs", "models", "contracts"]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"📁 Created directory: {directory}")

def main():
    """Main startup function."""
    print("🚀 Starting FinSage Backend...")
    print("=" * 50)
    
    # Create necessary directories
    create_directories()
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  Warning: .env file not found!")
        print("   Please create a .env file with your configuration.")
        print("   You can use .env.example as a template.")
        print()
    
    # Start the application
    print("🌐 Starting FastAPI server...")
    print("   - API Documentation: http://localhost:8000/docs")
    print("   - Health Check: http://localhost:8000/health")
    print("   - API Base URL: http://localhost:8000/api/v1")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 FinSage Backend stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error starting FinSage Backend: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
