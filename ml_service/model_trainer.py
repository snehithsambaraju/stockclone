"""
LSTM Model Training and Evaluation
"""
import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from datetime import datetime
from config import (
    SEQUENCE_LENGTH, PREDICTION_DAYS, TRAIN_TEST_SPLIT,
    LSTM_UNITS, DROPOUT_RATE, EPOCHS, BATCH_SIZE, LEARNING_RATE,
    MODELS_DIR, MODEL_VERSION
)
from data_preprocessor import StockDataPreprocessor

class LSTMModelTrainer:
    """Handles LSTM model training, evaluation, and saving"""
    
    def __init__(self):
        self.preprocessor = StockDataPreprocessor()
        self.model = None
        self.history = None
        
    def build_model(self, input_shape):
        """
        Build LSTM model architecture
        
        Args:
            input_shape: Shape of input data (sequence_length, features)
        
        Returns:
            Compiled Keras model
        """
        model = Sequential([
            Input(shape=input_shape),
            LSTM(units=LSTM_UNITS, return_sequences=True),
            Dropout(DROPOUT_RATE),
            LSTM(units=LSTM_UNITS, return_sequences=True),
            Dropout(DROPOUT_RATE),
            LSTM(units=LSTM_UNITS),
            Dropout(DROPOUT_RATE),
            Dense(units=25, activation='relu'),
            Dense(units=1)
        ])
        
        optimizer = Adam(learning_rate=LEARNING_RATE)
        model.compile(optimizer=optimizer, loss='mse', metrics=['mae'])
        
        return model
    
    def train(self, symbol, period="2y", retrain=False):
        """
        Train LSTM model for a stock symbol
        
        Args:
            symbol: Stock symbol
            period: Data period for training
            retrain: Whether to retrain existing model
        
        Returns:
            Training history and evaluation metrics
        """
        print(f"Training model for {symbol}...")
        
        # Fetch and preprocess data
        df = self.preprocessor.fetch_stock_data(symbol, period)
        df = self.preprocessor.calculate_technical_indicators(df)
        
        # Prepare sequences
        X, y = self.preprocessor.prepare_sequences(
            df, SEQUENCE_LENGTH, PREDICTION_DAYS
        )
        
        if len(X) < 100:
            raise ValueError(f"Insufficient data for training. Got {len(X)} samples.")
        
        # Split data
        split_idx = int(len(X) * TRAIN_TEST_SPLIT)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Reshape for LSTM (samples, timesteps, features)
        print(f"Training samples: {len(X_train)}, Test samples: {len(X_test)}")
        print(f"Input shape: {X_train.shape}")
        
        # Build model
        self.model = self.build_model((X_train.shape[1], X_train.shape[2]))
        
        # Callbacks
        callbacks = [
            EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=0.00001,
                verbose=1
            ),
            ModelCheckpoint(
                filepath=str(MODELS_DIR / f"{symbol}_best.h5"),
                monitor='val_loss',
                save_best_only=True,
                verbose=1
            )
        ]
        
        # Train model
        self.history = self.model.fit(
            X_train, y_train,
            batch_size=BATCH_SIZE,
            epochs=EPOCHS,
            validation_data=(X_test, y_test),
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluate
        metrics = self.evaluate(X_test, y_test)
        
        # Save model and preprocessor
        self.save_model(symbol)
        
        return {
            'history': self.history.history,
            'metrics': metrics,
            'symbol': symbol
        }
    
    def evaluate(self, X_test, y_test):
        """
        Evaluate model performance
        
        Args:
            X_test: Test features
            y_test: Test targets
        
        Returns:
            Dictionary of evaluation metrics
        """
        predictions = self.model.predict(X_test, verbose=0)
        
        # Inverse transform predictions
        # Create dummy arrays for inverse transform
        pred_dummy = np.zeros((len(predictions), X_test.shape[2]))
        pred_dummy[:, 3] = predictions.flatten()  # Close price at index 3
        predictions_actual = self.preprocessor.scaler.inverse_transform(pred_dummy)[:, 3]
        
        y_dummy = np.zeros((len(y_test), X_test.shape[2]))
        y_dummy[:, 3] = y_test.flatten()
        y_actual = self.preprocessor.scaler.inverse_transform(y_dummy)[:, 3]
        
        # Calculate metrics
        mae = mean_absolute_error(y_actual, predictions_actual)
        mse = mean_squared_error(y_actual, predictions_actual)
        rmse = np.sqrt(mse)
        mape = np.mean(np.abs((y_actual - predictions_actual) / y_actual)) * 100
        r2 = r2_score(y_actual, predictions_actual)
        
        # Calculate directional accuracy
        direction_actual = np.diff(y_actual) > 0
        direction_pred = np.diff(predictions_actual) > 0
        directional_accuracy = np.mean(direction_actual == direction_pred) * 100
        
        return {
            'mae': float(mae),
            'mse': float(mse),
            'rmse': float(rmse),
            'mape': float(mape),
            'r2': float(r2),
            'directional_accuracy': float(directional_accuracy)
        }
    
    def save_model(self, symbol):
        """Save model and preprocessor"""
        model_path = MODELS_DIR / f"{symbol}_model.h5"
        scaler_path = MODELS_DIR / f"{symbol}_scaler.pkl"
        feature_scaler_path = MODELS_DIR / f"{symbol}_feature_scaler.pkl"
        
        self.model.save(str(model_path))
        joblib.dump(self.preprocessor.scaler, scaler_path)
        joblib.dump(self.preprocessor.feature_scaler, feature_scaler_path)
        
        print(f"Model saved: {model_path}")
    
    def load_model(self, symbol):
        """Load trained model.

        Tolerant to symbols without exchange suffix. For example,
        if the model was trained as 'RELIANCE.NS' but the API is called
        with 'RELIANCE', this will automatically try common suffixes
        (.NS, .BO) when looking for model files.
        """
        # Try exact symbol first, then with common Indian exchange suffixes
        candidate_symbols = [symbol]
        base = symbol.upper()
        if not base.endswith(".NS") and not base.endswith(".BO"):
            candidate_symbols.append(f"{base}.NS")
            candidate_symbols.append(f"{base}.BO")

        found_symbol = None
        model_path = None

        for sym in candidate_symbols:
            # Prefer explicitly saved final model; fall back to best checkpoint
            m_path = MODELS_DIR / f"{sym}_model.h5"
            if not os.path.exists(m_path):
                m_path = MODELS_DIR / f"{sym}_best.h5"

            if os.path.exists(m_path):
                found_symbol = sym
                model_path = m_path
                break

        if found_symbol is None or model_path is None:
            raise FileNotFoundError(f"Model files not found for {symbol}")

        # Load for inference only; avoids legacy training-object
        # deserialization issues (e.g. keras.metrics.mse in older .h5 files).
        self.model = load_model(str(model_path), compile=False)

        print(f"Model loaded: {model_path}")
        return True
    
    def predict(self, symbol, days_ahead=1):
        """
        Make prediction for a stock
        
        Args:
            symbol: Stock symbol
            days_ahead: Number of days to predict
        
        Returns:
            Prediction and confidence metrics
        """
        # Load model if not loaded
        if self.model is None:
            self.load_model(symbol)
        
        # Fetch recent data
        df = self.preprocessor.fetch_stock_data(symbol, period="3mo")
        df = self.preprocessor.calculate_technical_indicators(df)
        
        # Prepare last sequence
        feature_columns = [
            'open', 'high', 'low', 'close', 'volume',
            'rsi', 'macd', 'macd_signal', 'macd_hist',
            'sma_20', 'sma_50', 'ema_12',
            'bb_upper', 'bb_middle', 'bb_lower', 'bb_width',
            'price_change', 'high_low_ratio', 'close_sma20_ratio',
            'volume_ratio'
        ]
        available_features = [col for col in feature_columns if col in df.columns]
        data = df[available_features].values

        # Fit feature scaler on the current feature data for inference
        # (We don't rely on saved scalers here.)
        self.preprocessor.feature_scaler.fit(data)
        scaled_data = self.preprocessor.feature_scaler.transform(data)
        
        # Get last sequence
        last_sequence = scaled_data[-SEQUENCE_LENGTH:].reshape(1, SEQUENCE_LENGTH, len(available_features))
        
        # Predict
        prediction_scaled = self.model.predict(last_sequence, verbose=0)[0][0]
        
        # Fit price scaler on recent close prices for inverse transform
        close_values = df["close"].values.reshape(-1, 1)
        self.preprocessor.scaler.fit(close_values)

        # Inverse transform predicted close
        pred_dummy = np.zeros((1, 1))
        pred_dummy[0, 0] = prediction_scaled  # Scaled close value
        prediction_actual = self.preprocessor.scaler.inverse_transform(pred_dummy)[0, 0]
        
        # Calculate confidence (using prediction variance)
        # For production, use ensemble or Monte Carlo dropout
        current_price = df['close'].iloc[-1]
        price_change_pct = ((prediction_actual - current_price) / current_price) * 100
        
        # Simple confidence calculation based on recent volatility
        recent_volatility = df['close'].tail(20).std() / df['close'].tail(20).mean()
        confidence = max(0, min(100, 100 - (recent_volatility * 100)))
        
        return {
            'symbol': symbol,
            'current_price': float(current_price),
            'predicted_price': float(prediction_actual),
            'predicted_change': float(price_change_pct),
            'confidence': float(confidence),
            'prediction_date': datetime.now().isoformat()
        }

