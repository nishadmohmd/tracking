// Frontend (React) - App.js

import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState(null);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
      setStockData(response.data);
      setError("");

      // Fetch historical data for charts
      const historyResponse = await axios.get(`http://localhost:5000/api/stocks/history/${symbol}`);
      const history = historyResponse.data;

      // Prepare data for the chart
      const labels = history.map((item) => item.date).reverse(); // X-axis (Dates)
      const prices = history.map((item) => item.close).reverse(); // Y-axis (Closing Prices)

      setChartData({
        labels,
        datasets: [
          {
            label: `${symbol} Stock Price`,
            data: prices,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    } catch (err) {
      console.error("❌ Error fetching stock data:", err.message);
      setError("Failed to fetch stock data.");
      setStockData(null);
      setChartData(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>📈 Stock Market Tracker</h1>
      <input
        type="text"
        placeholder="Enter Stock Symbol (e.g., AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
      />
      <button onClick={fetchStockData} style={{ padding: "10px", fontSize: "16px" }}>
        Get Stock Data
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {stockData && (
        <div style={{ marginTop: "20px" }}>
          <h2>{stockData.price?.longName} ({stockData.price?.symbol})</h2>
          <p>💰 Price: ${stockData.price?.regularMarketPrice}</p>
          <p>📈 High: ${stockData.summaryDetail?.dayHigh}</p>
          <p>📉 Low: ${stockData.summaryDetail?.dayLow}</p>
        </div>
      )}

      {chartData && (
        <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
          <h2>📊 Stock Price Trend</h2>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default App;
