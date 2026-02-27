@echo off
REM Quick Start Script for ML Service (Windows)

echo 🚀 Starting Stock Prediction ML Service Setup...

REM Check Python version
python --version
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.9+
    pause
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Create necessary directories
echo 📁 Creating directories...
if not exist "models" mkdir models
if not exist "data" mkdir data

REM Copy environment file
if not exist ".env" (
    echo ⚙️  Creating .env file...
    copy .env.example .env
    echo ✅ Please edit .env file with your configuration
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Train models: python train_models.py
echo 2. Start service: python app.py
echo.
echo Or use gunicorn for production:
echo gunicorn -w 4 -b 0.0.0.0:5000 app:app
echo.
pause

