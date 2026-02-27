"""
Configuration file for ML Service
"""
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Model paths
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(exist_ok=True)

DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# Model parameters
SEQUENCE_LENGTH = 60  # Number of days to look back
PREDICTION_DAYS = 1  # Predict next day
TRAIN_TEST_SPLIT = 0.8

# Technical indicator parameters
RSI_PERIOD = 14
MACD_FAST = 12
MACD_SLOW = 26
MACD_SIGNAL = 9
SMA_SHORT = 20
SMA_LONG = 50
EMA_PERIOD = 12

# LSTM model parameters
LSTM_UNITS = 50
DROPOUT_RATE = 0.2
EPOCHS = 50
BATCH_SIZE = 32
LEARNING_RATE = 0.001

# API Configuration
API_HOST = os.getenv("ML_API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("ML_API_PORT", "5000"))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Model versioning
MODEL_VERSION = "1.0.0"

