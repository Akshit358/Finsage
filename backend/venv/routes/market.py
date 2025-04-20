# Get Live Crypto/Stock Data
# backend/routes/market.py
import requests
from fastapi import APIRouter
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()

API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

@router.get("/crypto/{symbol}")
def get_crypto_price(symbol: str):
    url = f"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency={symbol}&to_currency=USD&apikey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    try:
        price = data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
        return {"symbol": symbol.upper(), "usd_price": float(price)}
    except:
        return {"error": "API response error or symbol not found"}
