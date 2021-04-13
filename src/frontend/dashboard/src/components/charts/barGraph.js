import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AccountBarGraph(props) {
  return (
    <BarChart
      width={500}
      height={300}
      data={props.barGraphData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="integration_name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="credit" fill="#8884d8" />
      <Bar dataKey="debit" fill="#82ca9d" />
    </BarChart>
  );
}
