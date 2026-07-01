# config.py

# Quotex Credentials
QUOTEX_EMAIL = "qaswed124@gmail.com"
QUOTEX_PASSWORD = "123456"
PRACTICE_MODE = True # Reverted due to library crash

# Trading Parameters
ASSET = "EURUSD"
TIMEFRAME = 60 # 60 seconds (1 minute) candles
BASE_AMOUNT = 1 # Trade amount in dollars
MAX_DAILY_LOSS = 10 # Stop bot after $10 loss

# Strategy Thresholds
RSI_OVERSOLD = 50
RSI_OVERBOUGHT = 50
MIN_ML_CONFIDENCE = 0.50 # Minimum confidence from ML model to place trade

# Telegram Integration
TELEGRAM_BOT_TOKEN = "8678524015:AAEUt0IpmPvP1NvU5Drz2sZ3-DwBpwgRjbY"
TELEGRAM_CHAT_ID = "5035440547"
