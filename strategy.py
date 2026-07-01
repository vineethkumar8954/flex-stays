import pandas as pd
from ta.momentum import RSIIndicator

class RSIStrategy:
    def __init__(self, period=14, overbought=70, oversold=30):
        self.period = period
        self.overbought = overbought
        self.oversold = oversold

    def get_signal(self, candles: list[dict]) -> str | None:
        """
        candles: list of dicts with 'close' prices.
        Returns "UP", "DOWN", or None.
        """
        if len(candles) < self.period:
            return None
        
        df = pd.DataFrame(candles)
        if 'close' not in df.columns:
            return None
            
        df['close'] = df['close'].astype(float)
        
        # Calculate RSI
        rsi_indicator = RSIIndicator(close=df['close'], window=self.period)
        rsi_values = rsi_indicator.rsi()
        
        # Get the latest RSI value
        latest_rsi = rsi_values.iloc[-1]
        
        if pd.isna(latest_rsi):
            return None
            
        if latest_rsi > self.overbought:
            return "DOWN"
        elif latest_rsi < self.oversold:
            return "UP"
            
        return None
