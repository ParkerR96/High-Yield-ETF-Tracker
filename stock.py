import requests
from bs4 import BeautifulSoup
from robin_stocks import *
import os
from dotenv import load_dotenv

class Stock:
    def __init__(self, symbol,buy_by_weekday,):
        self.symbol = symbol
        self.dividend = 0.0
        self.current_dividend_yield = 0.0
        self.buy_by_weekday = buy_by_weekday
        self.price = 0.0
    
    def getprice(self):
        load_dotenv()
        robinhood_username = os.getenv("ROBINHOOD_USERNAME")
        robinhood_password = os.getenv("ROBINHOOD_PASSWORD")
        login = robinhood.login(robinhood_username, robinhood_password)
        self.price = float(robinhood.stocks.get_latest_price(self.symbol)[0])

    def getDividend(self):
        print(self.symbol)
        url = f'https://yieldmaxetfs.com/our-etfs/{self.symbol}/'
        print(url)
        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching the URL: {e}")

        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        first_row = soup.select("table.distributions-table tr")[1]
        self.dividend = float(soup.select("table.distributions-table tr")[1].find("td").text.strip('$'))
        print(self.dividend)
    
    def getCurrentDividendYield(self):
        self.getprice()
        self.getDividend()
        self.current_dividend_yield = self.dividend / self.price * 100