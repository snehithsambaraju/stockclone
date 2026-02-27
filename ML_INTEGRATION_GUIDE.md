# Stock Price Prediction ML Integration Guide

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [ML Model Comparison](#ml-model-comparison)
3. [Setup Instructions](#setup-instructions)
4. [API Documentation](#api-documentation)
5. [Frontend Integration](#frontend-integration)
6. [Production Deployment](#production-deployment)
7. [Improvements & Best Practices](#improvements--best-practices)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                          │
│  - StockPrediction Component                               │
│  - Chart Visualization                                     │
│  - Technical Indicators Display                           │
└────────────────────┬──────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js + Express Backend                     │
│  - /api/predictions/predict                                │
│  - /api/predictions/batch                                  │
│  - /api/predictions/indicators                             │
│  - MongoDB Integration                                     │
└────────────────────┬──────────────────────────────────────┘
                     │ HTTP/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            Python ML Microservice (Flask)                  │
│  - LSTM Model Training                                     │
│  - Price Prediction                                        │
│  - Technical Indicators Calculation                        │
│  - Model Versioning                                        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Sources                            │
│  - Yahoo Finance API (yfinance)                           │
│  - MongoDB (Historical Data)                              │
│  - Model Cache (Pickle Files)                             │
└─────────────────────────────────────────────────────────────┘
```

### Why Separate Python Microservice?

1. **Technology Stack**: Python has superior ML libraries (TensorFlow, scikit-learn)
2. **Scalability**: Can scale ML service independently
3. **Resource Management**: ML models require more CPU/RAM
4. **Deployment Flexibility**: Can deploy on GPU-enabled servers
5. **Maintenance**: Easier to update models without affecting Node.js backend

---

## 🤖 ML Model Comparison

### Model Comparison Table

| Model | Pros | Cons | Best For |
|-------|------|------|----------|
| **LSTM** ✅ | • Captures long-term dependencies<br>• Handles non-linear patterns<br>• Excellent for time-series | • Requires more data<br>• Longer training time | **Time-series prediction** |
| **ARIMA** | • Good for linear trends<br>• Interpretable<br>• Fast training | • Misses non-linear patterns<br>• Requires stationarity | Linear trends only |
| **XGBoost** | • Handles tabular data well<br>• Feature importance<br>• Fast inference | • Less effective for pure time-series<br>• Requires feature engineering | Tabular data with features |
| **Linear Regression** | • Simple<br>• Fast<br>• Interpretable | • Too simplistic<br>• Poor for volatile markets | Baseline only |

### Recommendation: **LSTM (Long Short-Term Memory)**

**Why LSTM?**
- Stock prices are sequential/time-series data
- LSTM can remember long-term patterns
- Handles volatility and non-linear relationships
- State-of-the-art for financial time-series prediction
- Can learn complex market dynamics

---

## 🚀 Setup Instructions

### 1. Python ML Service Setup

```bash
# Navigate to ML service directory
cd ml_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Note: TA-Lib installation may require additional steps
# Windows: Download wheel from https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib
# Linux: sudo apt-get install ta-lib-dev
# Mac: brew install ta-lib

# Set environment variables
cp .env.example .env
# Edit .env file with your settings

# Train initial models (optional but recommended)
python train_models.py

# Start ML service
python app.py
# Or with gunicorn for production:
# gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 2. Node.js Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Add ML_SERVICE_URL to .env file
echo "ML_SERVICE_URL=http://localhost:5000" >> .env

# Start backend server
npm start
```

### 3. React Frontend Setup

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start development server
npm start
```

### 4. MongoDB Setup

Ensure MongoDB is running and accessible. The schemas will be created automatically when data is inserted.

---

## 📡 API Documentation

### ML Service Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ML Prediction Service",
  "timestamp": "2024-01-15T10:30:00"
}
```

#### 2. Predict Stock Price
```http
POST /api/v1/predict
Content-Type: application/json

{
  "symbol": "RELIANCE",
  "days_ahead": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "RELIANCE",
    "current_price": 2450.50,
    "predicted_price": 2480.75,
    "predicted_change": 1.23,
    "confidence": 72.5,
    "prediction_date": "2024-01-15T10:30:00"
  }
}
```

#### 3. Train Model
```http
POST /api/v1/train
Content-Type: application/json

{
  "symbol": "RELIANCE",
  "period": "2y",
  "retrain": false
}
```

#### 4. Batch Prediction
```http
POST /api/v1/batch-predict
Content-Type: application/json

{
  "symbols": ["RELIANCE", "TCS", "INFY"],
  "days_ahead": 1
}
```

#### 5. Technical Indicators
```http
POST /api/v1/technical-indicators
Content-Type: application/json

{
  "symbol": "RELIANCE",
  "period": "3mo"
}
```

### Node.js Backend Endpoints

All endpoints proxy to ML service and add MongoDB persistence:

- `POST /api/predictions/predict` - Get prediction
- `GET /api/predictions/:symbol` - Get latest prediction
- `POST /api/predictions/batch` - Batch predictions
- `POST /api/predictions/indicators` - Technical indicators
- `POST /api/predictions/train` - Train model
- `GET /api/predictions/:symbol/history` - Prediction history

---

## 🎨 Frontend Integration

### Using StockPrediction Component

```jsx
import StockPrediction from './components/StockPrediction';

function App() {
  return (
    <div>
      <StockPrediction symbol="RELIANCE" />
    </div>
  );
}
```

### Features:
- Real-time price prediction
- Confidence visualization
- Technical indicators display
- Prediction history chart
- Error handling and loading states

---

## 🚢 Production Deployment

### 1. ML Service Deployment

**Using Docker:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

**Using Gunicorn:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 --timeout 120 app:app
```

### 2. Model Retraining Strategy

**Scheduled Retraining:**
```python
# Use cron job or task scheduler
# Retrain models weekly/monthly
0 2 * * 0 python train_models.py  # Every Sunday at 2 AM
```

**Incremental Training:**
- Retrain with new data daily
- Use transfer learning for faster training
- A/B test new models before deployment

### 3. Monitoring

- **Model Performance**: Track prediction accuracy
- **API Latency**: Monitor response times
- **Error Rates**: Log and alert on failures
- **Resource Usage**: CPU, RAM, GPU utilization

---

## 🔧 Improvements & Best Practices

### 1. Enhanced Technical Indicators

**Already Implemented:**
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- Bollinger Bands

**Additional Indicators to Add:**
- Stochastic Oscillator
- ADX (Average Directional Index)
- OBV (On-Balance Volume)
- Fibonacci Retracements

### 2. Sentiment Analysis Integration

```python
# Example: Add news sentiment analysis
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")

def get_stock_sentiment(symbol):
    # Fetch news articles
    news = fetch_news(symbol)
    
    # Analyze sentiment
    sentiments = [sentiment_analyzer(article) for article in news]
    
    # Aggregate sentiment score
    avg_sentiment = calculate_average_sentiment(sentiments)
    
    return avg_sentiment
```

**Integration Steps:**
1. Fetch news from financial APIs (NewsAPI, Alpha Vantage)
2. Use NLP models (BERT, FinBERT) for sentiment analysis
3. Add sentiment score as feature to LSTM model
4. Retrain model with sentiment features

### 3. Advanced Model Improvements

**Ensemble Methods:**
```python
# Combine multiple models
predictions = {
    'lstm': lstm_model.predict(data),
    'xgboost': xgb_model.predict(data),
    'transformer': transformer_model.predict(data)
}

# Weighted average
final_prediction = weighted_average(predictions, weights=[0.5, 0.3, 0.2])
```

**Attention Mechanisms:**
- Add attention layers to LSTM
- Focus on important time steps
- Improve interpretability

**Transformer Models:**
- Use Transformer architecture
- Better long-range dependencies
- State-of-the-art performance

### 4. Data Quality Improvements

- **Data Validation**: Check for missing/outlier data
- **Data Augmentation**: Synthetic data generation
- **Feature Selection**: Remove redundant features
- **Normalization**: Better scaling techniques

### 5. Production Best Practices

**Caching:**
```python
from functools import lru_cache
import redis

redis_client = redis.Redis(host='localhost', port=6379)

@lru_cache(maxsize=100)
def get_prediction(symbol):
    # Check Redis cache first
    cached = redis_client.get(f"prediction:{symbol}")
    if cached:
        return json.loads(cached)
    
    # Make prediction
    result = model.predict(symbol)
    
    # Cache for 1 hour
    redis_client.setex(f"prediction:{symbol}", 3600, json.dumps(result))
    return result
```

**Rate Limiting:**
```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["100 per hour"]
)

@app.route('/api/v1/predict')
@limiter.limit("10 per minute")
def predict():
    # ...
```

**Error Handling:**
- Graceful degradation
- Fallback to simpler models
- Comprehensive logging
- Alerting system

**Security:**
- API authentication (JWT tokens)
- Input validation
- Rate limiting
- CORS configuration

### 6. Model Versioning

```python
# Model versioning system
MODEL_VERSION = "1.0.0"
MODEL_PATH = f"models/{symbol}_v{MODEL_VERSION}.h5"

# Track model performance
model_metrics = {
    'version': MODEL_VERSION,
    'mse': 0.05,
    'mae': 2.3,
    'r2': 0.85,
    'trained_date': '2024-01-15'
}
```

### 7. A/B Testing

```python
# Deploy multiple model versions
if user_id % 2 == 0:
    prediction = model_v1.predict(symbol)
else:
    prediction = model_v2.predict(symbol)

# Track performance metrics
track_prediction_accuracy(user_id, model_version, actual_price, predicted_price)
```

---

## 📊 Performance Metrics

### Model Evaluation Metrics

- **MAE (Mean Absolute Error)**: Average prediction error
- **RMSE (Root Mean Squared Error)**: Penalizes large errors
- **MAPE (Mean Absolute Percentage Error)**: Percentage error
- **R² Score**: Model fit quality
- **Directional Accuracy**: % of correct direction predictions

### Target Metrics

- **MAE**: < 2% of stock price
- **Directional Accuracy**: > 55%
- **R² Score**: > 0.7
- **API Latency**: < 500ms
- **Confidence**: > 60% for production use

---

## 🐛 Troubleshooting

### Common Issues

1. **ML Service Not Available**
   - Check if service is running: `curl http://localhost:5000/health`
   - Verify ML_SERVICE_URL in backend .env

2. **Model Not Found**
   - Train model first: `POST /api/v1/train`
   - Check models directory exists

3. **TA-Lib Installation Issues**
   - Windows: Download pre-built wheel
   - Linux: Install system dependencies first
   - Mac: Use Homebrew

4. **Memory Issues**
   - Reduce batch size
   - Use model quantization
   - Increase server RAM

---

## 📚 Additional Resources

- [TensorFlow LSTM Guide](https://www.tensorflow.org/guide/keras/rnn)
- [Financial Time Series Analysis](https://www.investopedia.com/)
- [Technical Indicators Explained](https://www.investopedia.com/trading/technical-indicators/)
- [Production ML Best Practices](https://ml-ops.org/)

---

## 📝 License

This implementation is for educational purposes. Always conduct your own research before making investment decisions.

---

**Built with ❤️ for Stock Trading Platform**

