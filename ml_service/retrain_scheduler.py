"""
Scheduled retraining script for ML models
Run this as a cron job or scheduled task
"""
import schedule
import time
from datetime import datetime
from model_trainer import LSTMModelTrainer
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('retrain.log'),
        logging.StreamHandler()
    ]
)

# Common stocks to retrain
STOCKS_TO_RETRAIN = [
    'RELIANCE.NS',
    'TCS.NS',
    'HDFCBANK.NS',
    'INFY.NS',
    'HINDUNILVR.NS',
    'ICICIBANK.NS',
    'BHARTIARTL.NS',
    'SBIN.NS',
    'ITC.NS',
    'KOTAKBANK.NS'
]

def retrain_models():
    """Retrain all models"""
    logging.info("Starting scheduled retraining...")
    trainer = LSTMModelTrainer()
    
    successful = 0
    failed = 0
    
    for symbol in STOCKS_TO_RETRAIN:
        try:
            logging.info(f"Retraining model for {symbol}...")
            result = trainer.train(symbol, period="2y", retrain=True)
            logging.info(f"✅ Successfully retrained {symbol}. Metrics: {result['metrics']}")
            successful += 1
        except Exception as e:
            logging.error(f"❌ Failed to retrain {symbol}: {str(e)}")
            failed += 1
    
    logging.info(f"Retraining complete. Successful: {successful}, Failed: {failed}")

# Schedule retraining
# Weekly retraining (every Sunday at 2 AM)
schedule.every().sunday.at("02:00").do(retrain_models)

# Daily retraining for critical stocks (optional)
# schedule.every().day.at("03:00").do(retrain_critical_stocks)

if __name__ == '__main__':
    logging.info("Retraining scheduler started. Waiting for scheduled time...")
    logging.info("Next retraining scheduled for: Every Sunday at 02:00")
    
    while True:
        schedule.run_pending()
        time.sleep(3600)  # Check every hour

