import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StockChart = ({ stockData }) => {
  if (!stockData["Time Series (Daily)"]) return <p>No data available</p>;

  const chartData = Object.entries(stockData["Time Series (Daily)"]).map(([date, values]) => ({
    date,
    close: parseFloat(values["4. close"]),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
