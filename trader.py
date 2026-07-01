from playwright.sync_api import Page
import time

class Trader:
    def __init__(self, page: Page):
        self.page = page
        
    def click_up(self):
        print("\n" + "="*40)
        print("🔔 SIGNAL ALERT: BUY UP (GREEN) 🔔")
        print("="*40 + "\n")
        # I have disabled the automatic clicking per your request:
        # try:
        #     self.page.locator("div.call-btn, button:has-text('Up'), .btn-call").first.click(timeout=3000)
        # except Exception as e:
        #     print(f"Failed to click UP: {e}")

    def click_down(self):
        print("\n" + "="*40)
        print("🔔 SIGNAL ALERT: SELL DOWN (RED) 🔔")
        print("="*40 + "\n")
        # I have disabled the automatic clicking per your request:
        # try:
        #     self.page.locator("div.put-btn, button:has-text('Down'), .btn-put").first.click(timeout=3000)
        # except Exception as e:
        #     print(f"Failed to click DOWN: {e}")
