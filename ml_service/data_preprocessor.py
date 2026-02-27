"""
Data preprocessing and feature engineering for stock price prediction
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class StockDataPreprocessor:
    """Handles data fetching, preprocessing, and feature engineering"""
    
    def __init__(self):
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.feature_scaler = MinMaxScaler(feature_range=(0, 1))
        
    def fetch_stock_data(self, symbol, period="2y"):
        """
        Fetch stock data from Yahoo Finance
        
        Args:
            symbol: Stock symbol (e.g., 'RELIANCE.NS' for NSE)
            period: Data period ('1y', '2y', '5y', etc.)
        
        Returns:
            DataFrame with OHLCV data
        """
        try:
            # For Indian stocks, add .NS suffix if not present
            if not symbol.endswith('.NS') and not symbol.endswith('.BO'):
                symbol = f"{symbol}.NS"
            
            ticker = yf.Ticker(symbol)
            df = ticker.history(period=period)
            
            if df.empty:
                raise ValueError(f"No data found for symbol: {symbol}")
            
            # Reset index to make Date a column
            df.reset_index(inplace=True)
            df.columns = [col.lower() if isinstance(col, str) else col for col in df.columns]
            
            # Ensure we have required columns
            required_cols = ['open', 'high', 'low', 'close', 'volume']
            if not all(col in df.columns for col in required_cols):
                raise ValueError(f"Missing required columns. Available: {df.columns.tolist()}")
            
            return df[['date', 'open', 'high', 'low', 'close', 'volume']]
        except Exception as e:
            raise Exception(f"Error fetching data for {symbol}: {str(e)}")
    
    def calculate_technical_indicators(self, df):
        """
        Calculate technical indicators
        
        Args:
            df: DataFrame with OHLCV data
        
        Returns:
            DataFrame with added technical indicators
        """
        df = df.copy()
        
        # RSI (Relative Strength Index)
        df['rsi'] = self._calculate_rsi(df['close'], period=14)
        
        # MACD (Moving Average Convergence Divergence)
        macd_data = self._calculate_macd(df['close'])
        df['macd'] = macd_data['macd']
        df['macd_signal'] = macd_data['signal']
        df['macd_hist'] = macd_data['hist']
        
        # Moving Averages
        df['sma_20'] = df['close'].rolling(window=20).mean()
        df['sma_50'] = df['close'].rolling(window=50).mean()
        df['ema_12'] = df['close'].ewm(span=12, adjust=False).mean()
        
        # Bollinger Bands
        bb_data = self._calculate_bollinger_bands(df['close'])
        df['bb_upper'] = bb_data['upper']
        df['bb_middle'] = bb_data['middle']
        df['bb_lower'] = bb_data['lower']
        df['bb_width'] = bb_data['width']
        
        # Price changes
        df['price_change'] = df['close'].pct_change()
        df['high_low_ratio'] = df['high'] / df['low']
        df['close_sma20_ratio'] = df['close'] / df['sma_20']
        
        # Volume indicators
        df['volume_sma'] = df['volume'].rolling(window=20).mean()
        df['volume_ratio'] = df['volume'] / df['volume_sma']
        
        # Fill NaN values
        df.bfill(inplace=True)  # Backward fill
        df.ffill(inplace=True)  # Forward fill
        df.fillna(0, inplace=True)  # Fill remaining NaN with 0
        
        return df
    
    def _calculate_rsi(self, prices, period=14):
        """Calculate RSI"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi
    
    def _calculate_macd(self, prices, fast=12, slow=26, signal=9):
        """Calculate MACD"""
        ema_fast = prices.ewm(span=fast, adjust=False).mean()
        ema_slow = prices.ewm(span=slow, adjust=False).mean()
        macd = ema_fast - ema_slow
        macd_signal = macd.ewm(span=signal, adjust=False).mean()
        macd_hist = macd - macd_signal
        return {
            'macd': macd,
            'signal': macd_signal,
            'hist': macd_hist
        }
    
    def _calculate_bollinger_bands(self, prices, period=20, std_dev=2):
        """Calculate Bollinger Bands"""
        sma = prices.rolling(window=period).mean()
        std = prices.rolling(window=period).std()
        return {
            'upper': sma + (std * std_dev),
            'middle': sma,
            'lower': sma - (std * std_dev),
            'width': (sma + (std * std_dev)) - (sma - (std * std_dev))
        }
    
    def prepare_sequences(self, df, sequence_length=60, prediction_days=1):
        """
        Prepare sequences for LSTM training
        
        Args:
            df: DataFrame with features
            sequence_length: Number of time steps to look back
            prediction_days: Number of days to predict ahead
        
        Returns:
            X, y: Features and targets
        """
        # Select feature columns
        feature_columns = [
            'open', 'high', 'low', 'close', 'volume',
            'rsi', 'macd', 'macd_signal', 'macd_hist',
            'sma_20', 'sma_50', 'ema_12',
            'bb_upper', 'bb_middle', 'bb_lower', 'bb_width',
            'price_change', 'high_low_ratio', 'close_sma20_ratio',
            'volume_ratio'
        ]
        
        # Filter available columns
        available_features = [col for col in feature_columns if col in df.columns]
        data = df[available_features].values
        
        # Scale features
        scaled_data = self.feature_scaler.fit_transform(data)
        
        X, y = [], []
        for i in range(sequence_length, len(scaled_data) - prediction_days + 1):
            X.append(scaled_data[i-sequence_length:i])
            y.append(scaled_data[i+prediction_days-1, 3])  # Close price is at index 3
        
        return np.array(X), np.array(y)
    
    def scale_data(self, data, fit=False):
        """Scale data using MinMaxScaler"""
        if fit:
            return self.scaler.fit_transform(data)
        return self.scaler.transform(data)
    
    def inverse_scale(self, scaled_data):
        """Inverse transform scaled data"""
        return self.scaler.inverse_transform(scaled_data)

