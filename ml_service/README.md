# Stock Price Prediction ML Service

## Architecture Overview

This is a production-ready Python microservice for stock price prediction using LSTM neural networks.

### Why LSTM?
- **LSTM (Long Short-Term Memory)**: Best for sequential/time-series data
  - Captures long-term dependencies in stock prices
  - Handles non-linear patterns better than ARIMA
  - Can learn complex market dynamics
  - Outperforms Linear Regression for time-series

- **ARIMA**: Good for linear trends but misses non-linear patterns
- **XGBoost**: Great for tabular data but less effective for pure time-series
- **Linear Regression**: Too simplistic for volatile stock markets

### Architecture Design

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│  Node.js     │─────▶│  Python ML  │
│  Frontend   │      │   Backend    │      │  Microservice│
└─────────────┘      └──────────────┘      └─────────────┘
                            │                       │
                            ▼                       ▼
                     ┌──────────────┐      ┌─────────────┐
                     │   MongoDB    │      │  Model Cache│
                     │  (Historical)│      │  (Pickle)   │
                     └──────────────┘      └─────────────┘
```

### Communication Flow
1. React requests prediction → Node.js API
2. Node.js forwards request → Python ML Service (REST API)
3. Python service loads model, preprocesses data, returns prediction
4. Node.js stores prediction in MongoDB
5. React displays prediction on chart

### Features
- LSTM-based price prediction
- Technical indicators (RSI, MACD, SMA, EMA)
- Model versioning and caching
- Batch prediction support
- Confidence intervals
- Retraining scheduler

