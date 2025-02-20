import React from 'react';
import { Task } from '../types';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProductivityMetricsProps {
  tasks: Task[];
  timeRange: 'day' | 'week' | 'month';
}

export function ProductivityMetrics({ tasks, timeRange }: ProductivityMetricsProps) {
  const getMetricsData = () => {
    const statusCount = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: ['Completed', 'In Progress', 'Pending'],
      datasets: [
        {
          data: [
            statusCount['completed'] || 0,
            statusCount['in-progress'] || 0,
            statusCount['pending'] || 0
          ],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)'
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(234, 179, 8)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      title: {
        display: true,
        text: `Task Status Distribution (${timeRange})`
      }
    }
  };

  return (
    <div className="h-[300px] flex items-center justify-center">
      <Doughnut data={getMetricsData()} options={options} />
    </div>
  );
}