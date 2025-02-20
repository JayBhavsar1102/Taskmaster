import React from 'react';
import { Task } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  tasks: Task[];
  timeRange: 'day' | 'week' | 'month';
}

export function PerformanceChart({ tasks, timeRange }: PerformanceChartProps) {
  const getChartData = () => {
    const dates = tasks.map(t => new Date(t.createdAt));
    const labels = dates.map(d => d.toLocaleDateString());
    
    const completedByDate = tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (task.status === 'completed' ? 1 : 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Array.from(new Set(labels)),
      datasets: [
        {
          label: 'Completed Tasks',
          data: Object.values(completedByDate),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Task Completion Trend (${timeRange})`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return <Line data={getChartData()} options={options} />;
}