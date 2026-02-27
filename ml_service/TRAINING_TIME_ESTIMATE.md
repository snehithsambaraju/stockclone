# Training Time Estimate

## 📊 Stock List
**Total Stocks**: 20 Indian stocks

1. RELIANCE.NS
2. TCS.NS
3. HDFCBANK.NS
4. INFY.NS
5. HINDUNILVR.NS
6. ICICIBANK.NS
7. BHARTIARTL.NS
8. SBIN.NS
9. ITC.NS
10. KOTAKBANK.NS
11. LT.NS
12. AXISBANK.NS
13. ASIANPAINT.NS
14. MARUTI.NS
15. TITAN.NS
16. NESTLEIND.NS
17. ULTRACEMCO.NS
18. WIPRO.NS
19. SUNPHARMA.NS
20. HCLTECH.NS

## ⏱️ Time Per Stock

Each stock training includes:
- **Data Fetching**: 30-60 seconds (from Yahoo Finance)
- **Feature Engineering**: 10-20 seconds (technical indicators)
- **Model Training**: 5-15 minutes (50 epochs with early stopping)

**Average Time Per Stock**: 8-12 minutes

## 🕐 Total Training Time

### Best Case Scenario (Fast CPU/Good Internet)
- **Per Stock**: ~5-7 minutes
- **Total (20 stocks)**: **~2-2.5 hours**

### Average Scenario (Standard CPU)
- **Per Stock**: ~8-12 minutes  
- **Total (20 stocks)**: **~2.5-4 hours**

### Worst Case Scenario (Slow CPU/Poor Internet)
- **Per Stock**: ~15-20 minutes
- **Total (20 stocks)**: **~5-6.5 hours**

## 💡 Recommendations

### Option 1: Train in Batches (Recommended)
Train stocks in groups of 5:
- **Batch 1** (5 stocks): ~40-60 minutes
- **Batch 2** (5 stocks): ~40-60 minutes
- **Batch 3** (5 stocks): ~40-60 minutes
- **Batch 4** (5 stocks): ~40-60 minutes

### Option 2: Train Critical Stocks First
Train only the most important stocks:
- RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK
- **Time**: ~40-60 minutes for 5 stocks

### Option 3: Parallel Training (Advanced)
Train multiple stocks simultaneously (requires more RAM)

### Option 4: Reduce Epochs (Faster but less accurate)
Modify `config.py` to reduce EPOCHS from 50 to 30
- **Time per stock**: ~5-8 minutes
- **Total**: ~2-3 hours

## 🚀 Quick Start Options

### Train All Stocks (Full Training)
```bash
cd ml_service
.\venv\Scripts\Activate.ps1
python train_models.py
```
**Estimated Time**: 2.5-4 hours

### Train Single Stock (Quick Test)
```bash
cd ml_service
.\venv\Scripts\Activate.ps1
python train_single.py RELIANCE.NS
```
**Estimated Time**: 8-12 minutes

### Train Top 5 Stocks
```bash
cd ml_service
.\venv\Scripts\Activate.ps1
python train_single.py RELIANCE.NS
python train_single.py TCS.NS
python train_single.py HDFCBANK.NS
python train_single.py INFY.NS
python train_single.py ICICIBANK.NS
```
**Estimated Time**: 40-60 minutes

## 📝 Notes

- Training can be stopped and resumed (models are saved individually)
- Each stock trains independently
- If one stock fails, others continue
- Models are saved as they complete
- You can use predictions as soon as individual models are trained

## ⚡ Speed Optimization Tips

1. **Use GPU** (if available): 3-5x faster
2. **Reduce EPOCHS**: Change from 50 to 30 in config.py
3. **Train overnight**: Let it run while you sleep
4. **Train incrementally**: Start with 5 stocks, add more later

