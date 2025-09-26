
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  { subject: "Math", score: 85 },
  { subject: "Science", score: 92 },
  { subject: "Physics", score: 78 },
  { subject: "Biology", score: 88 },
  { subject: "AI", score: 95 },
]

const chartConfig = {
  score: {
    label: "Avg. Score",
    color: "hsl(var(--chart-1))",
  },
}

export function AverageScoreChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Scores by Subject</CardTitle>
        <CardDescription>Shows the average student scores for each subject.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="score" fill="var(--color-score)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
