"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useState, useEffect } from "react";
import moment from "moment";
import { Bar, BarChart, } from "recharts"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Chart({ measurement }) {
  const [chartData, setChartData] = useState([]);
console.log("CHART, measurement", measurement);

const chartConfig = {
    value: {
      label: "value",
      color: "hsl(var(--chart-1))",
    },
  };

  useEffect(() => {
    if (measurement?.history) {
      const data = measurement.history.map(({ date, value }) => ({
        date: moment(date).format('DD/MM/YY HH:mm'),
        value,
      }));
      setChartData(data);

      console.log("CHART, data", data);
    }
  }, [measurement]);

  return (
    measurement && chartData.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>{measurement.name}</CardTitle>
          <CardDescription>{measurement.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
          </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    )
  );
}
