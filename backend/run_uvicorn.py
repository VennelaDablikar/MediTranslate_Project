import os
import sys

# Ensure backend/app is on sys.path so imports like `from services...` work
ROOT = os.path.dirname(__file__)
APP_PATH = os.path.join(ROOT, "app")
if APP_PATH not in sys.path:
    sys.path.insert(0, APP_PATH)

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
