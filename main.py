from stock import Stock
import os


def generate_stock_page(filename, day_label, ex_date_label, stocks, next_link, next_label):
    """
    Generates an HTML file for a specific YieldMax group.
    """
    print(f"\n--- Processing {day_label} List (Buy By) ---")
    valid_stocks = []
    
    for stock in stocks:
        print(f"Fetching data for {stock.symbol}...")
        try:
            # Populates price, dividend, and current_dividend_yield
            stock.getCurrentDividendYield()
            valid_stocks.append(stock)
        except Exception as e:
            print(f"XX Error fetching {stock.symbol}: {e}")

    # Sort by Yield (High to Low)
    valid_stocks.sort(key=lambda s: s.current_dividend_yield, reverse=True)

    # HTML Generation
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>YieldMax: Buy by {day_label}</title>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background-color: #f4f7f6; }}
            h1 {{ color: #2c3e50; }}
            .subtitle {{ color: #7f8c8d; margin-bottom: 20px; font-size: 1.1em; }}
            .note {{ background-color: #fff3cd; color: #856404; padding: 10px; border-left: 6px solid #ffeeba; margin-bottom: 20px; }}
            table {{ border-collapse: collapse; width: 100%; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }}
            th, td {{ padding: 15px; text-align: left; border-bottom: 1px solid #ddd; }}
            th {{ background-color: #2980b9; color: white; text-transform: uppercase; font-size: 0.9em; letter-spacing: 1px; }}
            tr:hover {{ background-color: #f1f1f1; }}
            td b {{ color: #27ae60; }}
            .nav-container {{ margin-top: 30px; text-align: center; }}
            .nav-link {{
                display: inline-block; padding: 15px 30px;
                background-color: #e74c3c; color: white; text-decoration: none;
                border-radius: 50px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                transition: background-color 0.3s;
            }}
            .nav-link:hover {{ background-color: #c0392b; }}
        </style>
    </head>
    <body>
        <h1>YieldMax ETFs: Buy By {day_label}</h1>
        <div class="subtitle">Standard Schedule: Ex-Date is {ex_date_label}</div>
        
        <div class="note">
            <strong>Note:</strong> Holidays may shift these dates. Always check the official calendar if a holiday falls on a declaration or ex-date.
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price ($)</th>
                    <th>Dividend ($)</th>
                    <th>Yield (%)</th>
                </tr>
            </thead>
            <tbody>
    """

    for stock in valid_stocks:
        html_content += f"""
                <tr>
                    <td>{stock.symbol}</td>
                    <td>{stock.price:.2f}</td>
                    <td>{stock.dividend:.2f}</td>
                    <td><b>{stock.current_dividend_yield:.2f}%</b></td>
                </tr>
        """

    html_content += f"""
            </tbody>
        </table>
        
        <div class="nav-container">
            <a href="{next_link}" class="nav-link">{next_label}</a>
        </div>
        
    </body>
    </html>
    """

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Successfully generated: {filename}")



def main():

    buy_monday_symbols = [
        "MSST", "NVIT", "TEST"
    ]


    buy_tuesday_symbols = [
        "CHPY", "GPTY", "LFGY", "MINY","QDTY",
        "RDTY", "SDTY", "SLTY", "ULTY", "YMAG",
        "YMAX"
    ]


    buy_wednesday_symbols = [
        "AIYY", "AMDY","AMZY","APLY","BABO","BRKC","CONY","CRCO",
        "CRSH", "CVNY", "DIPS","DRAY","FBY","FIAT","GDXY","GMEY",
        "GOOY","HIYY","HOOY","INYY","JPO","MARO","MRNY","MSFO","MSTY",
        "NFLY","NVDY","OARK","PLTY","PYPY","RBLY","SMCY","SNOY","TSLY",
        "TSMY","WNTR","XOMO","XYZY","YBIT","YQQQ"
    ]

    # Create Stock Objects
    monday_stocks = [Stock(sym, "Monday") for sym in buy_monday_symbols]
    tuesday_stocks = [Stock(sym, "Tuesday") for sym in buy_tuesday_symbols]
    wednesday_stocks = [Stock(sym, "Wednesday") for sym in buy_wednesday_symbols]

    # --- EXECUTION ---

    # 1. Generate Monday Page (Links to Tuesday)
    generate_stock_page(
        filename="buy_by_monday.html",
        day_label="Monday",
        ex_date_label="Tuesday",
        stocks=monday_stocks,
        next_link="buy_by_tuesday.html",
        next_label="Go to Group 1 (Buy by Tuesday) &rarr;"
    )

    # 2. Generate Tuesday Page (Links to Wednesday)
    generate_stock_page(
        filename="buy_by_tuesday.html",
        day_label="Tuesday",
        ex_date_label="Wednesday",
        stocks=tuesday_stocks,
        next_link="buy_by_wednesday.html",
        next_label="Go to Group 2 (Buy by Wednesday) &rarr;"
    )

    # 3. Generate Wednesday Page (Links back to Monday)
    generate_stock_page(
        filename="buy_by_wednesday.html",
        day_label="Wednesday",
        ex_date_label="Thursday",
        stocks=wednesday_stocks,
        next_link="buy_by_monday.html",
        next_label="&larr; Back to Group 3 (Buy by Monday)"
    )
    

if __name__ == "__main__":
    main()