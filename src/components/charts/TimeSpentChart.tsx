
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { subject: "Math", hours: 12.5 },
  { subject: "Science", hours: 10.2 },
  { subject: "Physics", hours: 8.1 },
  { subject: "Biology", hours: 15.3 },
  { subject: "AI", hours: 9.8 },
]

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-2))",
  },
}

export function TimeSpentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Spent on Subjects</CardTitle>
        <CardDescription>Total hours students spent on each subject this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="hours"
              type="natural"
              fill="var(--color-hours)"
              fillOpacity={0.4}
              stroke="var(--color-hours)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
