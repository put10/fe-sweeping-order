"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetBestsellingProducts,
  useGetProductsByStock,
} from "@/api/(front-office)/product/queries";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function ProductCharts() {
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = currentDate.getFullYear();

  // State for filters
  const [stockLimit, setStockLimit] = useState(10);
  const [bestsellingMonth, setBestsellingMonth] = useState(currentMonth);
  const [bestsellingYear, setBestsellingYear] = useState(currentYear);
  const [bestsellingLimit, setBestsellingLimit] = useState(10);

  // Fetch data with filters
  const { data: stockData, isLoading: isLoadingStock } =
    useGetProductsByStock(stockLimit);
  const { data: bestsellingData, isLoading: isLoadingBestselling } =
    useGetBestsellingProducts({
      month: bestsellingMonth,
      year: bestsellingYear,
      limit: bestsellingLimit,
    });

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
    },
  };

  // Prepare stock chart data
  const stockChartData = {
    labels: stockData?.data?.labels?.slice(0, stockLimit) || [],
    datasets: [
      {
        label: "Stock Level",
        data: stockData?.data?.values?.slice(0, stockLimit) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Prepare bestselling chart data
  const bestsellingChartData = {
    labels: bestsellingData?.data?.labels?.slice(0, bestsellingLimit) || [],
    datasets: [
      {
        label: "Units Sold",
        data: bestsellingData?.data?.values?.slice(0, bestsellingLimit) || [],
        backgroundColor: "rgba(53, 162, 235, 0.6)",
      },
    ],
  };

  // Generate month options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Generate year options (current year and 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Product Stock Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Product Stock Levels</CardTitle>
          <CardDescription>
            Current inventory levels of products
          </CardDescription>
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="stockLimit">Limit:</Label>
              <Input
                id="stockLimit"
                type="number"
                min="1"
                max="50"
                value={stockLimit}
                onChange={(e) => setStockLimit(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoadingStock ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading stock data...</p>
              </div>
            ) : (
              <Bar options={options} data={stockChartData} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bestselling Products Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Bestselling Products</CardTitle>
          <CardDescription>Top selling products</CardDescription>
          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bestsellingMonth">Month:</Label>
                <Select
                  value={bestsellingMonth.toString()}
                  onValueChange={(value) => setBestsellingMonth(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="bestsellingYear">Year:</Label>
                <Select
                  value={bestsellingYear.toString()}
                  onValueChange={(value) => setBestsellingYear(Number(value))}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="bestsellingLimit">Limit:</Label>
                <Input
                  id="bestsellingLimit"
                  type="number"
                  min="1"
                  max="50"
                  value={bestsellingLimit}
                  onChange={(e) => setBestsellingLimit(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoadingBestselling ? (
              <div className="flex items-center justify-center h-full">
                <p>Loading bestselling data...</p>
              </div>
            ) : (
              <Bar options={options} data={bestsellingChartData} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
