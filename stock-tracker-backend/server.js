// Backend (Express) - server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const yahooFinance = require("yahoo-finance2").default;
const Stock = require("./models/Stock");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("📈 Stock Tracking API is Running!");
});

// Fetch stock data using Yahoo Finance API
app.get("/api/stocks/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log("Fetching stock data for:", symbol);

    const stockData = await yahooFinance.quoteSummary(symbol, { modules: ["price", "summaryDetail"] });

    if (!stockData) {
      return res.status(400).json({ error: "Invalid stock symbol" });
    }

    res.json(stockData);
  } catch (error) {
    console.error("❌ Error fetching stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// Fetch historical stock data
app.get("/api/stocks/history/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    console.log("Fetching historical stock data for:", symbol);

    // Fetch historical data from Yahoo Finance
    const historicalData = await yahooFinance.historical(symbol, {
      period1: "2020-01-01", // Start date
      period2: "2025-01-01", // End date
      interval: "1d", // Daily data
    });

    if (!historicalData) {
      return res.status(400).json({ error: "Invalid stock symbol" });
    }

    res.json(historicalData);
  } catch (error) {
    console.error("❌ Error fetching historical stock data:", error.message);
    res.status(500).json({ error: "Failed to fetch historical stock data" });
  }
});

// Add stock to watchlist
app.post("/api/watchlist", async (req, res) => {
  try {
    const { symbol, name } = req.body;

    // Check if stock already exists
    const existingStock = await Stock.findOne({ symbol });
    if (existingStock) {
      return res.status(400).json({ error: "Stock already in watchlist" });
    }

    const stock = new Stock({ symbol, name });
    await stock.save();
    res.json({ message: "✅ Stock added to watchlist" });
  } catch (error) {
    console.error("❌ Error adding stock to watchlist:", error.message);
    res.status(500).json({ error: "Error adding stock to watchlist" });
  }
});

// Get all stocks from watchlist
app.get("/api/watchlist", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error("❌ Error fetching watchlist:", error.message);
    res.status(500).json({ error: "Error fetching watchlist" });
  }
});

// Delete a stock from watchlist
app.delete("/api/watchlist/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    await Stock.findOneAndDelete({ symbol });
    res.json({ message: "✅ Stock removed from watchlist" });
  } catch (error) {
    console.error("❌ Error removing stock from watchlist:", error.message);
    res.status(500).json({ error: "Error removing stock from watchlist" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
