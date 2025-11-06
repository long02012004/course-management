import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
} from "recharts";

// #region Sample data

// #endregion
const BarChartExample = ({ isAnimationActive = true, dataChart }) => (
  <BarChart
    style={{
      width: "95%",
      maxWidth: "700px",
      maxHeight: "70vh",
      aspectRatio: 1.618,
    }}
    responsive
    data={dataChart}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis width="auto" />
    <Tooltip />
    <Legend />
    <Bar dataKey="Qz" fill="#8884d8" isAnimationActive={isAnimationActive} />
    <Bar dataKey="Qs" fill="#82ca9d" isAnimationActive={isAnimationActive} />
    <Bar dataKey="As" fill="#1d3aa4ff" isAnimationActive={isAnimationActive} />
  </BarChart>
);

export default BarChartExample;
