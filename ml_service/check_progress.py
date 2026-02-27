"""
Check which stocks have completed training
"""
import os
from pathlib import Path

# All stocks to train
ALL_STOCKS = [
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

def check_training_progress():
    """Check which models are completed"""
    models_dir = Path(__file__).parent / "models"
    models_dir.mkdir(exist_ok=True)
    
    completed = []
    remaining = []
    
    for stock in ALL_STOCKS:
        # Check for final model or best checkpoint model
        model_file = models_dir / f"{stock}_model.h5"
        best_model_file = models_dir / f"{stock}_best.h5"
        scaler_file = models_dir / f"{stock}_scaler.pkl"
        feature_scaler_file = models_dir / f"{stock}_feature_scaler.pkl"
        
        # Check if model exists (either final or best checkpoint)
        # Scalers are optional for checking (they're created during training)
        if (model_file.exists() or best_model_file.exists()):
            completed.append(stock)
        else:
            remaining.append(stock)
    
    print("=" * 60)
    print("TRAINING PROGRESS REPORT")
    print("=" * 60)
    print(f"\n✅ COMPLETED: {len(completed)}/{len(ALL_STOCKS)} stocks")
    print(f"⏳ REMAINING: {len(remaining)}/{len(ALL_STOCKS)} stocks")
    print(f"📊 Progress: {len(completed)/len(ALL_STOCKS)*100:.1f}%")
    
    if completed:
        print(f"\n✅ Completed Stocks ({len(completed)}):")
        for i, stock in enumerate(completed, 1):
            print(f"   {i:2d}. {stock}")
    
    if remaining:
        print(f"\n⏳ Remaining Stocks ({len(remaining)}):")
        for i, stock in enumerate(remaining, 1):
            print(f"   {i:2d}. {stock}")
    
    print("\n" + "=" * 60)
    
    return completed, remaining

if __name__ == '__main__':
    completed, remaining = check_training_progress()
    
    if remaining:
        print("\n💡 To continue training remaining stocks tomorrow:")
        print("   python train_remaining.py")
        print("\n   Or train individually:")
        for stock in remaining[:5]:  # Show first 5
            print(f"   python train_single.py {stock}")
        if len(remaining) > 5:
            print(f"   ... and {len(remaining) - 5} more")

