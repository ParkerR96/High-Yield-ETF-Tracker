from robin_stocks import *
import os
from dotenv import load_dotenv
robinhood_username = os.getenv("ROBINHOOD_USERNAME")
robinhood_password = os.getenv("ROBINHOOD_PASSWORD")
my_dict = {};
login = robinhood.login(robinhood_username, robinhood_password)
print(robinhood.account.get_total_dividends())
instrumentList = robinhood.account.get_dividends("instrument")
dividentList = robinhood.account.get_dividends("amount")
for i in range(len(instrumentList)):
    try:
        my_dict[robinhood.get_symbol_by_url(instrumentList[i])] += float(dividentList[i])
    except KeyError:
        my_dict[robinhood.get_symbol_by_url(instrumentList[i])] = float(dividentList[i])
    
for i in my_dict:
    print(i, my_dict[i])