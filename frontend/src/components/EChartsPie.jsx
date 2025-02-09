import React from "react";
import ReactECharts from "echarts-for-react";

const EChartsPie = ({ data, theme = "light" }) => {
  const options = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: ${c} ({d}%)",
      backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
      textStyle: {
        color: theme === "light" ? "#1e293b" : "#f8fafc"
      },
      borderColor: theme === "light" ? "#e2e8f0" : "#334155"
    },
    series: [
      {
        name: "Account Balances",
        type: "pie",
        radius: "50%",
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return <ReactECharts option={options} style={{ height: 350, width: "100%" }} />;
};

export default EChartsPie;
