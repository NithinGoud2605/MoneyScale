import React from "react";
import ReactECharts from "echarts-for-react";

const EChartsPie = ({ data }) => {
  const options = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: ${c} ({d}%)",
    },
    series: [
      {
        name: "Account Balances",
        type: "pie",
        radius: "50%",
        data: data,
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
