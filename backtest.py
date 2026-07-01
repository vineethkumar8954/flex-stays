import yfinance as yf
import pandas as pd
from strategy import add_indicators

def backtest(ticker="EURUSD=X", interval="1m", period="7d"):
    print(f"Downloading data for {ticker}...")
    df = yf.download(ticker, interval=interval, period=period)
    
    if df.empty:
        print("No data fetched. Try different parameters.")
        return
        
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)
        
    df = add_indicators(df)
    df.dropna(inplace=True)
    
    trades = 0
    wins = 0
    losses = 0
    pnl = 0.0
    base_amount = 1.0
    payout_rate = 0.82 # 82% payout
    
    print("Running backtest...")
    
    # Simple vectorised backtest approximation (checking next candle close)
    for i in range(1, len(df)-1):
        ema9 = df['ema9'].iloc[i]
        ema21 = df['ema21'].iloc[i]
        rsi = df['rsi'].iloc[i]
        
        signal = None
        if ema9 > ema21 and rsi < 60:
            signal = "call"
        elif ema9 < ema21 and rsi > 40:
            signal = "put"
            
        if signal:
            trades += 1
            # Check next candle close compared to current close
            current_close = df['Close'].iloc[i]
            next_close = df['Close'].iloc[i+1]
            
            if signal == "call":
                won = next_close > current_close
            else:
                won = next_close < current_close
                
            if won:
                wins += 1
                pnl += (base_amount * payout_rate)
            else:
                losses += 1
                pnl -= base_amount
                
    win_rate = (wins / trades) * 100 if trades > 0 else 0
    print("\n=== Backtest Results ===")
    print(f"Asset: {ticker}")
    print(f"Total Trades: {trades}")
    print(f"Wins: {wins}")
    print(f"Losses: {losses}")
    print(f"Win Rate: {win_rate:.2f}%")
    print(f"Net PnL: ${pnl:.2f}")

if __name__ == "__main__":
    backtest()
