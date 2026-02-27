# Training Progress Tracker

## 🚀 Training Started: All 20 Stocks

**Start Time**: Training in progress...
**Estimated Completion**: 2.5-4 hours from start

## 📊 Stock List (20 stocks)

### Batch 1 (Top 5)
- [ ] RELIANCE.NS
- [ ] TCS.NS
- [ ] HDFCBANK.NS
- [ ] INFY.NS
- [ ] ICICIBANK.NS

### Batch 2
- [ ] BHARTIARTL.NS
- [ ] SBIN.NS
- [ ] ITC.NS
- [ ] KOTAKBANK.NS
- [ ] LT.NS

### Batch 3
- [ ] AXISBANK.NS
- [ ] ASIANPAINT.NS
- [ ] MARUTI.NS
- [ ] TITAN.NS
- [ ] NESTLEIND.NS

### Batch 4
- [ ] ULTRACEMCO.NS
- [ ] WIPRO.NS
- [ ] SUNPHARMA.NS
- [ ] HCLTECH.NS
- [ ] HINDUNILVR.NS

## 📝 How to Check Progress

### Check if training is running:
```powershell
Get-Process python | Where-Object {$_.Path -like "*ml_service*"}
```

### Check completed models:
```powershell
cd ml_service
ls models\*.h5
```

### Check training logs:
The training output will show in the terminal where you started it.

## ✅ Models will be saved to:
`ml_service/models/{SYMBOL}_model.h5`

Example:
- `RELIANCE.NS_model.h5`
- `TCS.NS_model.h5`
- etc.

## 🎯 After Training Completes

You can test predictions:
```powershell
# Test through Node.js backend
curl -X POST http://localhost:3002/api/predictions/predict -H "Content-Type: application/json" -d '{\"symbol\": \"RELIANCE\", \"days_ahead\": 1}'
```

## ⚠️ Notes

- Training runs sequentially (one stock at a time)
- Each model saves immediately after completion
- If training stops, completed models are still usable
- You can use predictions for completed stocks while others train
- Check the terminal output for real-time progress

## 📈 Expected Output

For each stock, you'll see:
```
==================================================
Training RELIANCE.NS
==================================================
Training samples: XXX, Test samples: XXX
Input shape: (XXX, 60, XX)
Epoch 1/50...
...
✅ Successfully trained RELIANCE.NS
Metrics: {'mae': X.XX, 'rmse': X.XX, ...}
```

