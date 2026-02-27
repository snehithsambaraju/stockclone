import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./StockPrediction.css";

const DEFAULT_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "HINDUNILVR",
  "BHARTIARTL",
  "SBIN",
  "ITC",
  "KOTAKBANK",
  "LT",
  "AXISBANK",
  "ASIANPAINT",
  "MARUTI",
  "TITAN",
  "NESTLEIND",
  "ULTRACEMCO",
  "WIPRO",
  "SUNPHARMA",
  "HCLTECH",
];

const StockPrediction = ({ symbol: initialSymbol = "RELIANCE" }) => {
  const [symbol, setSymbol] = useState(initialSymbol.toUpperCase());
  const [symbolInput, setSymbolInput] = useState(initialSymbol.toUpperCase());
  const [prediction, setPrediction] = useState(null);
  const [indicators, setIndicators] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  const fetchPrediction = async () => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch prediction
      const predResponse = await axios.post(
        "http://localhost:3002/api/predictions/predict",
        { symbol, days_ahead: 1 }
      );

      if (predResponse.data.success) {
        setPrediction(predResponse.data.data);
      }

      // Fetch technical indicators
      const indResponse = await axios.post(
        "http://localhost:3002/api/predictions/indicators",
        { symbol, period: "3mo" }
      );

      if (indResponse.data.success) {
        setIndicators(indResponse.data.data);
      }

      // Fetch prediction history
      const histResponse = await axios.get(
        `http://localhost:3002/api/predictions/${symbol}/history?limit=30`
      );

      if (histResponse.data.success) {
        setHistory(histResponse.data.data);
        prepareChartData(histResponse.data.data);
      }
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setError(
        err.response?.data?.error ||
          "Failed to fetch prediction. Ensure ML service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (historyData) => {
    const data = historyData
      .slice()
      .reverse()
      .map((item) => ({
        date: new Date(item.prediction_date).toLocaleDateString(),
        current: item.current_price,
        predicted: item.predicted_price,
        actual: item.current_price, // In production, this would be actual price
      }));

    setChartData(data);
  };

  useEffect(() => {
    if (symbol) {
      fetchPrediction();
    }
  }, [symbol]);

  const handleSymbolSubmit = () => {
    const next = symbolInput.trim().toUpperCase();
    if (!next) return;
    setSymbol(next);
  };

  const renderSymbolControls = () => (
    <div className="prediction-actions">
      <select
        className="symbol-select"
        value={symbolInput}
        onChange={(e) => setSymbolInput(e.target.value)}
      >
        {DEFAULT_SYMBOLS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        className="symbol-input"
        type="text"
        value={symbolInput}
        onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
        placeholder="Enter symbol"
      />
      <button onClick={handleSymbolSubmit} className="refresh-btn">
        Apply
      </button>
      <button onClick={fetchPrediction} className="refresh-btn">
        Refresh
      </button>
    </div>
  );

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return "#10b981"; // green
    if (confidence >= 50) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getChangeColor = (change) => {
    return change >= 0 ? "#10b981" : "#ef4444";
  };

  if (loading) {
    return (
      <div className="prediction-container">
        {renderSymbolControls()}
        <div className="loading">Loading prediction...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prediction-container">
        {renderSymbolControls()}
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchPrediction} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="prediction-container">
        {renderSymbolControls()}
        <p>Select a stock to see predictions</p>
      </div>
    );
  }

  return (
    <div className="prediction-container">
      <div className="prediction-header">
        <h2>Price Prediction: {prediction.symbol}</h2>
        {renderSymbolControls()}
      </div>

      <div className="prediction-grid">
        {/* Main Prediction Card */}
        <div className="prediction-card main">
          <h3>Next Day Prediction</h3>
          <div className="price-comparison">
            <div className="price-item">
              <span className="label">Current Price</span>
              <span className="value current">
                ₹{prediction.current_price.toFixed(2)}
              </span>
            </div>
            <div className="arrow">→</div>
            <div className="price-item">
              <span className="label">Predicted Price</span>
              <span
                className="value predicted"
                style={{ color: getChangeColor(prediction.predicted_change) }}
              >
                ₹{prediction.predicted_price.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="change-info">
            <span
              className="change"
              style={{ color: getChangeColor(prediction.predicted_change) }}
            >
              {prediction.predicted_change >= 0 ? "+" : ""}
              {prediction.predicted_change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Confidence Card */}
        <div className="prediction-card">
          <h3>Confidence</h3>
          <div className="confidence-display">
            <div
              className="confidence-circle"
              style={{
                background: `conic-gradient(${getConfidenceColor(
                  prediction.confidence
                )} ${prediction.confidence * 3.6}deg, #e5e7eb 0deg)`,
              }}
            >
              <div className="confidence-inner">
                <span className="confidence-value">
                  {prediction.confidence.toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="confidence-label">
              {prediction.confidence >= 70
                ? "High Confidence"
                : prediction.confidence >= 50
                ? "Medium Confidence"
                : "Low Confidence"}
            </p>
          </div>
        </div>

        {/* Technical Indicators */}
        {indicators && (
          <div className="prediction-card indicators">
            <h3>Technical Indicators</h3>
            <div className="indicators-grid">
              <div className="indicator-item">
                <span className="indicator-label">RSI</span>
                <span
                  className="indicator-value"
                  style={{
                    color:
                      indicators.indicators.rsi > 70
                        ? "#ef4444"
                        : indicators.indicators.rsi < 30
                        ? "#10b981"
                        : "#6b7280",
                  }}
                >
                  {indicators.indicators.rsi.toFixed(2)}
                </span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">MACD</span>
                <span className="indicator-value">
                  {indicators.indicators.macd.toFixed(2)}
                </span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">SMA (20)</span>
                <span className="indicator-value">
                  ₹{indicators.indicators.sma_20.toFixed(2)}
                </span>
              </div>
              <div className="indicator-item">
                <span className="indicator-label">SMA (50)</span>
                <span className="indicator-value">
                  ₹{indicators.indicators.sma_50.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prediction History Chart */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <h3>Prediction History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Current Price"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>
          <strong>Disclaimer:</strong> Stock price predictions are generated
          using machine learning models and should not be considered as
          financial advice. Past performance does not guarantee future results.
          Always conduct your own research before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default StockPrediction;

