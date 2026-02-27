"""
Train stocks in batches for better control
"""
from model_trainer import LSTMModelTrainer
import sys

# Stock batches
BATCHES = {
    'batch1': ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS'],
    'batch2': ['BHARTIARTL.NS', 'SBIN.NS', 'ITC.NS', 'KOTAKBANK.NS', 'LT.NS'],
    'batch3': ['AXISBANK.NS', 'ASIANPAINT.NS', 'MARUTI.NS', 'TITAN.NS', 'NESTLEIND.NS'],
    'batch4': ['ULTRACEMCO.NS', 'WIPRO.NS', 'SUNPHARMA.NS', 'HCLTECH.NS', 'HINDUNILVR.NS']
}

def train_batch(batch_name='batch1'):
    """Train a specific batch of stocks"""
    if batch_name not in BATCHES:
        print(f"❌ Unknown batch: {batch_name}")
        print(f"Available batches: {', '.join(BATCHES.keys())}")
        return
    
    stocks = BATCHES[batch_name]
    print(f"\n🚀 Training Batch: {batch_name}")
    print(f"📊 Stocks: {len(stocks)}")
    print(f"⏱️  Estimated Time: 40-60 minutes\n")
    
    trainer = LSTMModelTrainer()
    successful = []
    failed = []
    
    for symbol in stocks:
        try:
            print(f"\n{'='*50}")
            print(f"Training {symbol} ({stocks.index(symbol) + 1}/{len(stocks)})")
            print(f"{'='*50}")
            
            result = trainer.train(symbol, period='2y', retrain=False)
            
            print(f"\n✅ Successfully trained {symbol}")
            print(f"   MAE: {result['metrics']['mae']:.2f}")
            print(f"   RMSE: {result['metrics']['rmse']:.2f}")
            print(f"   R²: {result['metrics']['r2']:.4f}")
            
            successful.append(symbol)
            
        except Exception as e:
            print(f"\n❌ Failed to train {symbol}: {str(e)}")
            failed.append({'symbol': symbol, 'error': str(e)})
    
    print(f"\n{'='*50}")
    print(f"Batch {batch_name} Complete!")
    print(f"{'='*50}")
    print(f"✅ Successful: {len(successful)}/{len(stocks)}")
    print(f"❌ Failed: {len(failed)}/{len(stocks)}")
    
    if successful:
        print(f"\n✅ Trained models:")
        for s in successful:
            print(f"   - {s}")
    
    if failed:
        print(f"\n❌ Failed models:")
        for f in failed:
            print(f"   - {f['symbol']}: {f['error']}")

if __name__ == '__main__':
    batch = sys.argv[1] if len(sys.argv) > 1 else 'batch1'
    train_batch(batch)

