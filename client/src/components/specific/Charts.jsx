import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Chart as ChartJS,
  Legend,
  plugins,
  scales,
} from "chart.js";
import { lightPurple, orange, purple } from "../../constants/color";
import { getLast7Days } from "../../library/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

export const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: purple,
      },
    ],
  };
  return <Line data={data} />;
};

export const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  cutout: 90,
};

export const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Total Chats Vs Group Chats",
        backgroundColor: [lightPurple, orange],
        borderColor: [purple, orange],
        offset: 10,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export default { DoughnutChart };
