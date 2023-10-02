import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

const PieChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  useEffect(() => {
    if (data && chartRef.current) {
      // Si el gráfico ya existe, destrúyelo
      if (chartInstance) {
        chartInstance.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: "# registros",
          datasets: [
            {
              data: data,
              backgroundColor: 12,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
      // Establece la instancia del gráfico en el estado
      setChartInstance(newChartInstance);
    }
  }, [data, chartInstance]);
  return <canvas ref={chartRef} />;
};
export default PieChart;
