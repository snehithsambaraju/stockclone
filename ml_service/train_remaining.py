"""
Train only the remaining stocks that haven't been trained yet
"""
from model_trainer import LSTMModelTrainer
from check_progress import ALL_STOCKS
from pathlib import Path

def train_remaining():
    """Train only stocks that don't have models yet"""
    models_dir = Path(__file__).parent / "models"
    models_dir.mkdir(exist_ok=True)
    
    # Find remaining stocks
    remaining = []
    for stock in ALL_STOCKS:
        model_file = models_dir / f"{stock}_model.h5"
        best_model_file = models_dir / f"{stock}_best.h5"
        
        # Check if either final model or best checkpoint exists
        if not (model_file.exists() or best_model_file.exists()):
            remaining.append(stock)
    
    if not remaining:
        print("✅ All stocks are already trained!")
        return
    
    print(f"\n🚀 Training {len(remaining)} remaining stocks...")
    print(f"⏱️  Estimated time: {len(remaining) * 10} minutes ({len(remaining) * 10 / 60:.1f} hours)\n")
    
    trainer = LSTMModelTrainer()
    successful = []
    failed = []
    
    for symbol in remaining:
        try:
            print(f"\n{'='*50}")
            print(f"Training {symbol} ({remaining.index(symbol) + 1}/{len(remaining)})")
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
    print("Training Complete!")
    print(f"{'='*50}")
    print(f"✅ Successful: {len(successful)}/{len(remaining)}")
    print(f"❌ Failed: {len(failed)}/{len(remaining)}")
    
    if successful:
        print(f"\n✅ Trained models:")
        for s in successful:
            print(f"   - {s}")
    
    if failed:
        print(f"\n❌ Failed models:")
        for f in failed:
            print(f"   - {f['symbol']}: {f['error']}")

if __name__ == '__main__':
    train_remaining()

