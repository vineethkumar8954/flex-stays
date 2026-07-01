import asyncio
from telegram import Bot
import config

async def send_message_async(text):
    from datetime import datetime
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted_text = f"⏱ <i>{current_time}</i>\n\n{text}"
    
    if config.TELEGRAM_BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN":
        print(f"[Telegram Mock] {formatted_text}")
        return
        
    try:
        bot = Bot(token=config.TELEGRAM_BOT_TOKEN)
        await bot.send_message(chat_id=config.TELEGRAM_CHAT_ID, text=formatted_text, parse_mode='HTML')
    except Exception as e:
        print(f"[Telegram Error] Failed to send message: {e}")

def send_message(text):
    """Wrapper to run async telegram send from synchronous code if needed"""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(send_message_async(text))
        else:
            loop.run_until_complete(send_message_async(text))
    except RuntimeError:
        asyncio.run(send_message_async(text))

def send_signal(asset, direction, rsi, confidence=None):
    conf_text = f" | Confidence: {confidence*100:.1f}%" if confidence else ""
    msg = f"<b>[SIGNAL] New Signal</b>\nAsset: {asset}\nDirection: {direction.upper()}\nRSI: {rsi:.1f}{conf_text}"
    send_message(msg)

def send_result(asset, direction, result, pnl):
    msg = f"<b>[{result.upper()}] Trade Result</b>\nAsset: {asset}\nDirection: {direction.upper()}\nResult: {result.upper()}\nPnL: ${pnl:.2f}"
    send_message(msg)
