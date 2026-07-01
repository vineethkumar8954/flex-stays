from playwright.sync_api import sync_playwright
from analyzer import Analyzer
from strategy import RSIStrategy
from trader import Trader
import time
import json

DEBUG_URL = "http://127.0.0.1:9222"

def main():
    analyzer = Analyzer()
    strategy = RSIStrategy()
    
    with sync_playwright() as p:
        print(f"Connecting to your real Chrome browser at {DEBUG_URL}...")
        try:
            browser = p.chromium.connect_over_cdp(DEBUG_URL)
        except Exception as e:
            print("ERROR: Could not connect to your Chrome browser.")
            print("Did you run the Start_Real_Chrome.bat file?")
            return

        quotex_page = None
        for context in browser.contexts:
            for page in context.pages:
                if "quotex" in page.url.lower() or "qxbroker" in page.url.lower():
                    quotex_page = page
                    break
            if quotex_page:
                break
                
        if not quotex_page:
            print("Quotex tab not found! Please open Quotex in the connected Chrome browser.")
            return
            
        print("Successfully connected to Quotex tab in your real browser!")
        trader = Trader(quotex_page)
        
        def handle_ws_frame(ws, frame):
            try:
                data = json.loads(frame)
                if 'price' in data:
                    analyzer.add_candle(data['price'])
            except:
                pass
                
        quotex_page.on("websocket", lambda ws: ws.on("framereceived", lambda payload: handle_ws_frame(ws, payload)))
        
        print("\n*** BOT IS ACTIVE ***")
        print("Monitoring your live chart for RSI signals...")
        
        try:
            while True:
                candles = analyzer.get_candles()
                signal = strategy.get_signal(candles)
                
                if signal == "UP":
                    print(f"RSI trigger! Placing UP trade at {time.strftime('%H:%M:%S')}")
                    trader.click_up()
                    time.sleep(60) 
                elif signal == "DOWN":
                    print(f"RSI trigger! Placing DOWN trade at {time.strftime('%H:%M:%S')}")
                    trader.click_down()
                    time.sleep(60)
                    
                time.sleep(1)
        except KeyboardInterrupt:
            print("Stopping bot...")
        finally:
            browser.disconnect()

if __name__ == "__main__":
    main()
