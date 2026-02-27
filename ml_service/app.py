"""
Flask API for Stock Price Prediction ML Service
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from model_trainer import LSTMModelTrainer
from data_preprocessor import StockDataPreprocessor
from config import API_HOST, API_PORT, DEBUG
import traceback

app = Flask(__name__)
CORS(app)

# Initialize trainer
trainer = LSTMModelTrainer()
preprocessor = StockDataPreprocessor()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ML Prediction Service',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/v1/predict', methods=['POST'])
def predict():
    """
    Predict stock price
    
    Request body:
    {
        "symbol": "RELIANCE",
        "days_ahead": 1
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'symbol' not in data:
            return jsonify({
                'error': 'Missing required field: symbol'
            }), 400
        
        symbol = data['symbol'].upper()
        days_ahead = data.get('days_ahead', 1)
        
        # Check if model exists, if not return error
        try:
            trainer.load_model(symbol)
        except FileNotFoundError:
            return jsonify({
                'error': f'Model not found for {symbol}. Please train the model first.',
                'symbol': symbol
            }), 404
        
        # Make prediction
        prediction = trainer.predict(symbol, days_ahead)
        
        return jsonify({
            'success': True,
            'data': prediction
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc() if DEBUG else None
        }), 500

@app.route('/api/v1/train', methods=['POST'])
def train():
    """
    Train model for a stock symbol
    
    Request body:
    {
        "symbol": "RELIANCE",
        "period": "2y",
        "retrain": false
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'symbol' not in data:
            return jsonify({
                'error': 'Missing required field: symbol'
            }), 400
        
        symbol = data['symbol'].upper()
        period = data.get('period', '2y')
        retrain = data.get('retrain', False)
        
        # Train model
        result = trainer.train(symbol, period, retrain)
        
        return jsonify({
            'success': True,
            'message': f'Model trained successfully for {symbol}',
            'data': {
                'symbol': result['symbol'],
                'metrics': result['metrics']
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc() if DEBUG else None
        }), 500

@app.route('/api/v1/batch-predict', methods=['POST'])
def batch_predict():
    """
    Batch prediction for multiple symbols
    
    Request body:
    {
        "symbols": ["RELIANCE", "TCS", "INFY"],
        "days_ahead": 1
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'symbols' not in data:
            return jsonify({
                'error': 'Missing required field: symbols'
            }), 400
        
        symbols = [s.upper() for s in data['symbols']]
        days_ahead = data.get('days_ahead', 1)
        
        results = []
        errors = []
        
        for symbol in symbols:
            try:
                trainer.load_model(symbol)
                prediction = trainer.predict(symbol, days_ahead)
                results.append(prediction)
            except Exception as e:
                errors.append({
                    'symbol': symbol,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'data': results,
            'errors': errors if errors else None
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc() if DEBUG else None
        }), 500

@app.route('/api/v1/technical-indicators', methods=['POST'])
def get_technical_indicators():
    """
    Get technical indicators for a symbol
    
    Request body:
    {
        "symbol": "RELIANCE",
        "period": "3mo"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'symbol' not in data:
            return jsonify({
                'error': 'Missing required field: symbol'
            }), 400
        
        symbol = data['symbol'].upper()
        period = data.get('period', '3mo')
        
        # Fetch and calculate indicators
        df = preprocessor.fetch_stock_data(symbol, period)
        df = preprocessor.calculate_technical_indicators(df)
        
        # Get latest values
        latest = df.iloc[-1].to_dict()
        
        return jsonify({
            'success': True,
            'data': {
                'symbol': symbol,
                'indicators': {
                    'rsi': float(latest.get('rsi', 0)),
                    'macd': float(latest.get('macd', 0)),
                    'macd_signal': float(latest.get('macd_signal', 0)),
                    'sma_20': float(latest.get('sma_20', 0)),
                    'sma_50': float(latest.get('sma_50', 0)),
                    'ema_12': float(latest.get('ema_12', 0)),
                    'bb_upper': float(latest.get('bb_upper', 0)),
                    'bb_lower': float(latest.get('bb_lower', 0))
                },
                'price': {
                    'open': float(latest.get('open', 0)),
                    'high': float(latest.get('high', 0)),
                    'low': float(latest.get('low', 0)),
                    'close': float(latest.get('close', 0)),
                    'volume': float(latest.get('volume', 0))
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc() if DEBUG else None
        }), 500

if __name__ == '__main__':
    print(f"Starting ML Service on {API_HOST}:{API_PORT}")
    app.run(host=API_HOST, port=API_PORT, debug=DEBUG)

