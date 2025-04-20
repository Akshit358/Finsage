# backend/main.py
from fastapi import FastAPI
from routes.routes import market

app = FastAPI(title="FinSage API")

app.include_router(market.router, prefix="/market")

@app.get("/")
def home():
    return {"message": "FinSage API is running"}
