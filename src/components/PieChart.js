import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Expenses", "Revenue"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 50],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "#272a37b3",

        // "rgba(255, 206, 86, 0.2)",
        // "rgba(75, 192, 192, 0.2)",
        // "rgba(153, 102, 255, 0.2)",
        // "rgba(255, 159, 64, 0.2)",
      ],
      // borderColor: [
      //   "rgba(255, 99, 132, 1)",
      //   "#272a37",
      //   // "rgba(255, 206, 86, 1)",
      //   // "rgba(75, 192, 192, 1)",
      //   // "rgba(153, 102, 255, 1)",
      //   // "rgba(255, 159, 64, 1)",
      // ],
      // borderWidth: 2,
    },
  ],
};

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "left",
    },
    title: {
      display: true,
      text: "Revenue / Expenses Chart",
    },
  },
  SVGPreserveAspectRatio: false,
};
export default function PieChart() {
  return <Doughnut data={data} options={options} />;
}
