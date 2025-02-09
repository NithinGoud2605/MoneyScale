import React from "react";
import { Bar, Line } from "react-chartjs-2";
import ReactECharts from "echarts-for-react";

const ChartSwitcher = ({ 
  chartView, 
  onChange, 
  barData, 
  dailyData, 
  echartsOptions, 
  getChartOptions 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-cyan-400">
          Expenses Chart - {chartView}
        </h2>
        <div className="flex space-x-2">
          {["Bar", "Daily", "Pie"].map((type) => (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`px-3 py-1 rounded-full border transition-colors ${
                chartView === type
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent"
                  : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[350px] w-full">
        {chartView === "Bar" && (
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, ...getChartOptions() }} />
        )}
        {chartView === "Daily" && (
          <Line data={dailyData} options={{ responsive: true, maintainAspectRatio: false, ...getChartOptions() }} />
        )}
        {chartView === "Pie" && (
          <ReactECharts option={echartsOptions} style={{ height: 350, width: "100%" }} />
        )}
      </div>
    </>
  );
};

export default ChartSwitcher;
