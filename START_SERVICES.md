# 🚀 Services Startup Guide

## Services Running

All three services have been started:

### 1. ✅ Node.js Backend (Port 3002)
- **Status**: Running
- **URL**: http://localhost:3002
- **Endpoints**: 
  - `/api/predictions/predict` - Get stock prediction
  - `/api/predictions/:symbol` - Latest prediction
  - `/allHoldings` - Get holdings
  - `/allPositions` - Get positions

### 2. ✅ React Frontend (Port 3000)
- **Status**: Running  
- **URL**: http://localhost:3000
- **Features**: Dashboard with prediction component

### 3. ✅ Python ML Service (Port 5000)
- **Status**: Running
- **URL**: http://localhost:5000
- **Endpoints**:
  - `/health` - Health check
  - `/api/v1/predict` - Predict stock price
  - `/api/v1/train` - Train model
  - `/api/v1/batch-predict` - Batch predictions
  - `/api/v1/technical-indicators` - Get indicators

## 📝 Next Steps

### 1. Train Initial Models

Before making predictions, you need to train models for stocks:

```bash
cd ml_service
.\venv\Scripts\Activate.ps1
python train_models.py
```

This will train models for common Indian stocks (RELIANCE, TCS, INFY, etc.)

**Note**: Training takes 5-30 minutes per stock. You can train individual stocks:

```python
# In Python shell or script
from model_trainer import LSTMModelTrainer
trainer = LSTMModelTrainer()
trainer.train('RELIANCE.NS', period='2y')
```

### 2. Test the Services

**Test ML Service:**
```bash
curl http://localhost:5000/health
```

**Test Backend:**
```bash
curl http://localhost:3002/allHoldings
```

**Test Prediction (after training):**
```bash
curl -X POST http://localhost:5000/api/v1/predict -H "Content-Type: application/json" -d "{\"symbol\": \"RELIANCE\", \"days_ahead\": 1}"
```

### 3. Access Frontend

Open your browser and navigate to:
- **Dashboard**: http://localhost:3000
- **Predictions Page**: http://localhost:3000/predictions

## 🔧 Troubleshooting

### ML Service Not Responding
- Check if Python service is running: `netstat -ano | findstr :5000`
- Check logs in the terminal where ML service is running
- Ensure virtual environment is activated

### Backend Can't Connect to ML Service
- Verify ML service is running on port 5000
- Check `.env` file in backend directory has: `ML_SERVICE_URL=http://localhost:5000`

### Frontend Can't Connect to Backend
- Verify backend is running on port 3002
- Check browser console for CORS errors
- Ensure backend CORS is enabled

### Model Not Found Error
- Train models first using `train_models.py`
- Or train individual stock: `POST /api/v1/train` with symbol

## 📊 Using the Prediction Feature

### From Frontend:
1. Navigate to http://localhost:3000/predictions
2. The component will automatically fetch prediction for RELIANCE
3. To change symbol, modify the `StockPrediction` component props

### From API:
```javascript
// JavaScript/React example
const response = await fetch('http://localhost:3002/api/predictions/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symbol: 'RELIANCE', days_ahead: 1 })
});
const data = await response.json();
console.log(data);
```

## 🛑 Stopping Services

To stop services:
1. **Backend**: Press `Ctrl+C` in backend terminal
2. **Frontend**: Press `Ctrl+C` in frontend terminal  
3. **ML Service**: Press `Ctrl+C` in ML service terminal

Or close the terminal windows.

## 📚 Documentation

- **Complete Guide**: See `ML_INTEGRATION_GUIDE.md`
- **Examples**: See `EXAMPLES.md`
- **Summary**: See `IMPLEMENTATION_SUMMARY.md`

---

**All services are ready! 🎉**

