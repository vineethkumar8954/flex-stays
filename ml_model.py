import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

MODEL_FILE = "rf_model.pkl"

def fetch_and_prepare_data(ticker="EURUSD=X"):
    print("Fetching training data...")
    df = yf.download(ticker, interval="5m", period="60d")
    
    # Feature Engineering
    df['ema9'] = df['Close'].ewm(span=9).mean()
    df['ema21'] = df['Close'].ewm(span=21).mean()
    df['ema_diff'] = df['ema9'] - df['ema21']
    
    delta = df['Close'].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = -delta.clip(upper=0).rolling(14).mean()
    rs = gain / loss
    df['rsi'] = 100 - (100 / (1 + rs))
    
    df['body'] = abs(df['Close'] - df['Open'])
    df['returns'] = df['Close'].pct_change()
    
    # Target: 1 if next close > current close, 0 otherwise
    df['target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
    
    df.dropna(inplace=True)
    return df

def train_model():
    df = fetch_and_prepare_data()
    features = ['ema_diff', 'rsi', 'body', 'returns']
    X = df[features]
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    print("Training Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=5)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"Model Accuracy on Test Data: {acc*100:.2f}%")
    
    joblib.dump(model, MODEL_FILE)
    print(f"Model saved to {MODEL_FILE}")

def predict_signal(df_recent):
    """Predict using the last row of features"""
    if not os.path.exists(MODEL_FILE):
        return None, 0.0
        
    model = joblib.load(MODEL_FILE)
    
    features = ['ema_diff', 'rsi', 'body', 'returns']
    X = df_recent[features].iloc[-1:]
    
    probs = model.predict_proba(X)[0]
    # probs[0] is prob of down, probs[1] is prob of up
    
    if probs[1] > 0.65:
        return "call", probs[1]
    elif probs[0] > 0.65:
        return "put", probs[0]
        
    return None, max(probs)

if __name__ == "__main__":
    train_model()
