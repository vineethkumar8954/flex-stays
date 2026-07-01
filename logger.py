import json
import os
from datetime import datetime

TRADES_FILE = "dashboard/trades.json"

def init_logger():
    if not os.path.exists(TRADES_FILE):
        with open(TRADES_FILE, 'w') as f:
            json.dump({"trades": []}, f)

def log_trade(asset, direction, amount, result, profit_loss):
    try:
        with open(TRADES_FILE, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {"trades": []}

    trade = {
        "id": len(data["trades"]) + 1,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "asset": asset,
        "direction": direction,
        "amount": amount,
        "result": result,
        "profit_loss": profit_loss
    }
    
    data["trades"].append(trade)
    
    with open(TRADES_FILE, 'w') as f:
        json.dump(data, f, indent=4)
        
def get_daily_loss():
    try:
        with open(TRADES_FILE, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        return 0
    
    today = datetime.now().strftime("%Y-%m-%d")
    daily_pnl = sum(t["profit_loss"] for t in data["trades"] if t["timestamp"].startswith(today))
    
    # If daily_pnl is negative, the loss is the absolute value
    return abs(daily_pnl) if daily_pnl < 0 else 0
