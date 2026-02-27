"""
Script to train models for common Indian stocks
Run this to pre-train models before starting the API
"""
from model_trainer import LSTMModelTrainer

# Common Indian stocks
INDIAN_STOCKS = [
    'RELIANCE.NS',
    'TCS.NS',
    'HDFCBANK.NS',
    'INFY.NS',
    'HINDUNILVR.NS',
    'ICICIBANK.NS',
    'BHARTIARTL.NS',
    'SBIN.NS',
    'ITC.NS',
    'KOTAKBANK.NS',
    'LT.NS',
    'AXISBANK.NS',
    'ASIANPAINT.NS',
    'MARUTI.NS',
    'TITAN.NS',
    'NESTLEIND.NS',
    'ULTRACEMCO.NS',
    'WIPRO.NS',
    'SUNPHARMA.NS',
    'HCLTECH.NS'
]

def train_all_models():
    """Train models for all stocks"""
    trainer = LSTMModelTrainer()
    
    successful = []
    failed = []
    
    for symbol in INDIAN_STOCKS:
        try:
            print(f"\n{'='*50}")
            print(f"Training {symbol}")
            print(f"{'='*50}")
            
            result = trainer.train(symbol, period="2y", retrain=False)
            
            print(f"\n✅ Successfully trained {symbol}")
            print(f"Metrics: {result['metrics']}")
            
            successful.append(symbol)
            
        except Exception as e:
            print(f"\n❌ Failed to train {symbol}: {str(e)}")
            failed.append({'symbol': symbol, 'error': str(e)})
    
    print(f"\n{'='*50}")
    print("Training Summary")
    print(f"{'='*50}")
    print(f"Successful: {len(successful)}/{len(INDIAN_STOCKS)}")
    print(f"Failed: {len(failed)}/{len(INDIAN_STOCKS)}")
    
    if successful:
        print(f"\n✅ Successfully trained models:")
        for s in successful:
            print(f"  - {s}")
    
    if failed:
        print(f"\n❌ Failed models:")
        for f in failed:
            print(f"  - {f['symbol']}: {f['error']}")

if __name__ == '__main__':
    train_all_models()

