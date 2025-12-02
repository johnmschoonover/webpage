import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  LineController,
  BarController,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line, Bar, Chart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  LineController,
  BarController
);

// --- Types ---
type ChartType = 'verification' | 'oscillation' | 'gap';

interface PrimeSieveChartsProps {
  chartType: ChartType;
}

interface GapSpectrumData {
  gap_size: number;
  success_rate: number;
  theoretical_boost: number;
  shield_score: number;
  shield_primes: string;
}

interface OscillationData {
  bin_start: number;
  ratio_s_p: number;
  [key: string]: number; // For dynamic gap rates
}

interface ReportMetadata {
  max_exponent: number;
  bins: number;
  max_n: number;
  target_gaps: number[];
}

// --- Configuration ---
// Pointing to the GitHub Pages deployment of the Rust tool's report
const BASE_URL = 'https://johnmschoonover.github.io/prime_shield_analyzer/';

// Dark mode friendly colors
const CHART_COLORS = {
  grid: 'rgba(255, 255, 255, 0.1)',
  text: '#9ca3af', // gray-400
  title: '#e5e7eb', // gray-200
  scatterOther: 'rgba(255, 255, 255, 0.3)',
};

export default function PrimeSieveCharts({ chartType }: PrimeSieveChartsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State to hold fetched data
  const [gapData, setGapData] = useState<GapSpectrumData[]>([]);
  const [oscData, setOscData] = useState<OscillationData[]>([]);
  const [metadata, setMetadata] = useState<ReportMetadata | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We fetch metadata first to get target gaps, then the datasets
        const [metaRes, gapRes, oscRes] = await Promise.all([
          fetch(`${BASE_URL}report_metadata.json`),
          fetch(`${BASE_URL}gap_spectrum.json`),
          fetch(`${BASE_URL}oscillation_series.json`),
        ]);

        if (!metaRes.ok || !gapRes.ok || !oscRes.ok) {
          throw new Error('Failed to fetch data files from GitHub Pages');
        }

        const meta: ReportMetadata = await metaRes.json();
        const gaps: GapSpectrumData[] = await gapRes.json();
        const osc: OscillationData[] = await oscRes.json();

        setMetadata(meta);
        setGapData(gaps);
        setOscData(osc);
      } catch (err) {
        console.error(err);
        setError('Failed to load chart data. The analysis pipeline may be running or the data is unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Loading / Error States ---
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
        <span className="text-muted-foreground animate-pulse">Loading analysis data from 10 Billion Primes...</span>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="w-full h-32 flex items-center justify-center bg-red-50/50 rounded-lg border border-red-200">
        <span className="text-red-500 text-sm">{error}</span>
      </div>
    );
  }

  // --- Chart: Theory Verification (Scatter) ---
  if (chartType === 'verification') {
    const verificationData = gapData.map((d) => ({
      x: d.theoretical_boost,
      y: d.success_rate,
      gap: d.gap_size,
      score: d.shield_score,
      primes: d.shield_primes,
    }));

    // Calculate Trendline (Linear Regression)
    const n = verificationData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    verificationData.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    });
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    const trendlinePoints = verificationData.map((p) => ({
      x: p.x,
      y: m * p.x + b,
    }));

    const data: ChartData<'scatter' | 'line'> = {
      datasets: [
        {
          type: 'scatter' as const,
          label: 'Gap 4 (Red)',
          data: verificationData.filter((p) => p.gap === 4),
          backgroundColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 6,
        },
        {
          type: 'scatter' as const,
          label: 'Gap 34 (Blue)',
          data: verificationData.filter((p) => p.gap === 34),
          backgroundColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 6,
        },
        {
          type: 'scatter' as const,
          label: 'Other Gaps',
          data: verificationData.filter((p) => p.gap !== 4 && p.gap !== 34),
          backgroundColor: CHART_COLORS.scatterOther,
          pointRadius: 3,
        },
        {
          type: 'line' as const,
          label: 'Trendline',
          data: trendlinePoints,
          borderColor: 'rgba(75, 192, 192, 0.8)',
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const options: ChartOptions<'scatter'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
            position: 'bottom',
            labels: { color: CHART_COLORS.text }
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const d = ctx.raw;
              if (!d.gap) return ''; // Trendline
              return `Gap: ${d.gap} | Rate: ${d.y.toFixed(3)}`;
            },
          },
        },
      },
      scales: {
        x: { 
            title: { display: true, text: 'Theoretical Boost Score', color: CHART_COLORS.title },
            grid: { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text }
        },
        y: { 
            title: { display: true, text: 'Observed Success Rate', color: CHART_COLORS.title },
            grid: { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text }
        },
      },
    };

    // Cast data to any to bypass strict type checking for mixed charts
    return (
      <div className="w-full h-96 relative">
        <Chart type='scatter' data={data as any} options={options} />
      </div>
    );
  }

  // --- Chart: Oscillation (Line) ---
  if (chartType === 'oscillation') {
    // Filter out last data point (often partial bin)
    const filteredOscData = oscData.slice(0, oscData.length - 1);
    
    const datasets = [
      {
        label: 'Ratio S_p / p',
        data: filteredOscData.map((d) => d.ratio_s_p),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
    ];

    // Add individual gap rates (hidden by default or explicit)
    const colors = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
    ];
    
    metadata.target_gaps.forEach((gap, idx) => {
       const key = `gap_${gap}_rate`;
       // Check if the key exists in the data
       if (filteredOscData.length > 0 && filteredOscData[0][key] !== undefined) {
           datasets.push({
               label: `Gap ${gap} Rate`,
               data: filteredOscData.map((d) => d[key]),
               borderColor: colors[idx % colors.length],
               borderWidth: 1,
               pointRadius: 0,
               tension: 0.1,
               // @ts-ignore - ChartJS types can be fussy with custom props
               hidden: true
           });
       }
    });

    const data: ChartData<'line'> = {
      labels: filteredOscData.map((d) => d.bin_start),
      datasets,
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
          mode: 'index',
          intersect: false,
      },
      plugins: {
        legend: { 
            position: 'bottom',
            labels: { color: CHART_COLORS.text }
        },
        tooltip: {
            callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${(ctx.raw as number).toFixed(4)}`
            }
        }
      },
      scales: {
        y: { 
            title: { display: true, text: 'Ratio', color: CHART_COLORS.title },
            grid: { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text }
        },
        x: {
          title: { display: true, text: 'N (Bin Start)', color: CHART_COLORS.title },
          grid: { color: CHART_COLORS.grid },
          ticks: { color: CHART_COLORS.text, maxTicksLimit: 8 },
        },
      },
    };

    return (
      <div className="w-full h-96 relative">
        <Line data={data} options={options} />
      </div>
    );
  }

  // --- Chart: Gap Spectrum (Bar) ---
  if (chartType === 'gap') {
    const limitedGapData = gapData.filter((d) => d.gap_size <= 60);
    
    const data: ChartData<'bar'> = {
      labels: limitedGapData.map((d) => d.gap_size),
      datasets: [
        {
          label: 'Success Rate',
          data: limitedGapData.map((d) => d.success_rate),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: CHART_COLORS.text } },
      },
      scales: {
        y: { 
            beginAtZero: true, 
            title: { display: true, text: 'Success Rate', color: CHART_COLORS.title },
            grid: { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text }
        },
        x: { 
            title: { display: true, text: 'Gap Size', color: CHART_COLORS.title },
            grid: { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text }
        },
      },
    };

    return (
      <div className="w-full h-96 relative">
        <Bar data={data} options={options} />
      </div>
    );
  }

  return null;
}
