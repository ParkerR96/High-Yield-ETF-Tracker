from stock import Stock

def main():
    stock = Stock("NVDY", "Thursday")
    stock.getCurrentDividendYield()
    for i in stock.__dict__:
        print(i, stock.__dict__[i])

if __name__ == "__main__":
    main()