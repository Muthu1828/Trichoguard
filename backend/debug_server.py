import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

try:
    print("Attempting to import app from main.py...")
    from main import app
    print("✅ App imported successfully")
    
    import uvicorn
    print("Starting uvicorn...")
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="debug")
except Exception as e:
    print("❌ ERROR DURING STARTUP:")
    import traceback
    traceback.print_exc()
    sys.exit(1)
