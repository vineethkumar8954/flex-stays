class Analyzer:
    def __init__(self):
        self.candles = []
        
    def add_candle(self, close_price: float):
        self.candles.append({"close": close_price})
        # Keep only the last 50 candles to save memory
        if len(self.candles) > 50:
            self.candles.pop(0)
            
    def get_candles(self):
        return self.candles
