# Usage Examples

## Frontend API Usage Examples

### 1. Get Prediction for a Stock

```javascript
import axios from 'axios';

// Single prediction
const getPrediction = async (symbol) => {
  try {
    const response = await axios.post(
      'http://localhost:3002/api/predictions/predict',
      {
        symbol: 'RELIANCE',
        days_ahead: 1
      }
    );
    
    if (response.data.success) {
      const prediction = response.data.data;
      console.log('Current Price:', prediction.current_price);
      console.log('Predicted Price:', prediction.predicted_price);
      console.log('Predicted Change:', prediction.predicted_change + '%');
      console.log('Confidence:', prediction.confidence + '%');
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.error);
  }
};

// Usage
getPrediction('RELIANCE');
```

### 2. Batch Prediction for Multiple Stocks

```javascript
const getBatchPredictions = async (symbols) => {
  try {
    const response = await axios.post(
      'http://localhost:3002/api/predictions/batch',
      {
        symbols: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK']
      }
    );
    
    if (response.data.success) {
      response.data.data.forEach(prediction => {
        console.log(`${prediction.symbol}: ₹${prediction.predicted_price.toFixed(2)}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.error);
  }
};
```

### 3. Get Technical Indicators

```javascript
const getIndicators = async (symbol) => {
  try {
    const response = await axios.post(
      'http://localhost:3002/api/predictions/indicators',
      {
        symbol: 'RELIANCE',
        period: '3mo'
      }
    );
    
    if (response.data.success) {
      const indicators = response.data.data.indicators;
      console.log('RSI:', indicators.rsi);
      console.log('MACD:', indicators.macd);
      console.log('SMA 20:', indicators.sma_20);
      console.log('SMA 50:', indicators.sma_50);
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.error);
  }
};
```

### 4. Get Prediction History

```javascript
const getPredictionHistory = async (symbol, limit = 30) => {
  try {
    const response = await axios.get(
      `http://localhost:3002/api/predictions/${symbol}/history?limit=${limit}`
    );
    
    if (response.data.success) {
      const history = response.data.data;
      // Use for charting
      return history.map(item => ({
        date: new Date(item.prediction_date),
        current: item.current_price,
        predicted: item.predicted_price,
        confidence: item.confidence
      }));
    }
  } catch (error) {
    console.error('Error:', error.response?.data?.error);
  }
};
```

### 5. React Hook Example

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const useStockPrediction = (symbol) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchPrediction = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.post(
          'http://localhost:3002/api/predictions/predict',
          { symbol, days_ahead: 1 }
        );
        
        if (response.data.success) {
          setPrediction(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch prediction');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrediction, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  return { prediction, loading, error };
};

// Usage in component
function StockCard({ symbol }) {
  const { prediction, loading, error } = useStockPrediction(symbol);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!prediction) return null;

  return (
    <div>
      <h3>{prediction.symbol}</h3>
      <p>Current: ₹{prediction.current_price.toFixed(2)}</p>
      <p>Predicted: ₹{prediction.predicted_price.toFixed(2)}</p>
      <p>Change: {prediction.predicted_change.toFixed(2)}%</p>
      <p>Confidence: {prediction.confidence.toFixed(0)}%</p>
    </div>
  );
}
```

## Python ML Service Examples

### 1. Train a Model

```python
from model_trainer import LSTMModelTrainer

trainer = LSTMModelTrainer()
result = trainer.train('RELIANCE.NS', period='2y', retrain=False)
print(f"Training complete. Metrics: {result['metrics']}")
```

### 2. Make Prediction

```python
from model_trainer import LSTMModelTrainer

trainer = LSTMModelTrainer()
trainer.load_model('RELIANCE.NS')
prediction = trainer.predict('RELIANCE.NS', days_ahead=1)
print(f"Predicted price: ₹{prediction['predicted_price']:.2f}")
```

### 3. Get Technical Indicators

```python
from data_preprocessor import StockDataPreprocessor

preprocessor = StockDataPreprocessor()
df = preprocessor.fetch_stock_data('RELIANCE.NS', period='3mo')
df = preprocessor.calculate_technical_indicators(df)

latest = df.iloc[-1]
print(f"RSI: {latest['rsi']:.2f}")
print(f"MACD: {latest['macd']:.2f}")
print(f"SMA 20: ₹{latest['sma_20']:.2f}")
```

## cURL Examples

### 1. Health Check

```bash
curl http://localhost:5000/health
```

### 2. Get Prediction

```bash
curl -X POST http://localhost:5000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"symbol": "RELIANCE", "days_ahead": 1}'
```

### 3. Train Model

```bash
curl -X POST http://localhost:5000/api/v1/train \
  -H "Content-Type: application/json" \
  -d '{"symbol": "RELIANCE", "period": "2y", "retrain": false}'
```

### 4. Batch Prediction

```bash
curl -X POST http://localhost:5000/api/v1/batch-predict \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["RELIANCE", "TCS", "INFY"], "days_ahead": 1}'
```

## Integration with WatchList

```javascript
// Add prediction to WatchList item
import { useState, useEffect } from 'react';
import axios from 'axios';

function WatchListItem({ stock }) {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3002/api/predictions/predict',
          { symbol: stock.name, days_ahead: 1 }
        );
        if (response.data.success) {
          setPrediction(response.data.data);
        }
      } catch (error) {
        // Handle error silently
      }
    };
    
    fetchPrediction();
  }, [stock.name]);

  return (
    <li>
      <div className="stock-info">
        <span>{stock.name}</span>
        <span>₹{stock.price}</span>
        {prediction && (
          <span className="prediction">
            Predicted: ₹{prediction.predicted_price.toFixed(2)}
            ({prediction.predicted_change >= 0 ? '+' : ''}
            {prediction.predicted_change.toFixed(2)}%)
          </span>
        )}
      </div>
    </li>
  );
}
```

