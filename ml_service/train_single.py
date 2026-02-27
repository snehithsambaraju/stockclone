"""
Quick script to train a single stock model for testing
"""
from model_trainer import LSTMModelTrainer
import sys

def train_single_stock(symbol='RELIANCE.NS'):
    """Train model for a single stock"""
    print(f"Training model for {symbol}...")
    print("This will take 5-15 minutes. Please wait...")
    
    trainer = LSTMModelTrainer()
    
    try:
        result = trainer.train(symbol, period='2y', retrain=False)
        print(f"\n✅ Successfully trained {symbol}!")
        print(f"\nModel Metrics:")
        print(f"  MAE: {result['metrics']['mae']:.2f}")
        print(f"  RMSE: {result['metrics']['rmse']:.2f}")
        print(f"  MAPE: {result['metrics']['mape']:.2f}%")
        print(f"  R² Score: {result['metrics']['r2']:.4f}")
        print(f"  Directional Accuracy: {result['metrics']['directional_accuracy']:.2f}%")
        print(f"\nModel saved to: models/{symbol}_model.h5")
        print("\nYou can now make predictions!")
        
    except Exception as e:
        print(f"\n❌ Error training {symbol}: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    symbol = sys.argv[1] if len(sys.argv) > 1 else 'RELIANCE.NS'
    train_single_stock(symbol)

