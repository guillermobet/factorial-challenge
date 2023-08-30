"use client";

import { bigAmountFormatter, currencyFormatter } from "@/lib/utils";
import {
  AreaChart as RechartsAreaChart,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col bg-black/[.75] rounded-lg border-black p-4 gap-1">
        <div className="flex flex-row justify-between items-baseline text-lg font-bold gap-4">
          <p className="pb-2">{`From ${payload[0].payload.hour}:00 to ${payload[0].payload.hour}:59`}</p>
          <span>⌚️</span>
        </div>
        <p className="text-xs">{`Total in transactions: ${currencyFormatter(
          "EUR"
        ).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export function AreaChart({ chartValues }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        data={chartValues}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
        width={100}
        height={100}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#103FEF" stopOpacity={0.95} />
            <stop offset="95%" stopColor="#103FEF" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="hour"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          dataKey="total"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickCount={10}
          tickFormatter={(value: number) => `${bigAmountFormatter(value)} €`}
        />
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#103FEF"
          strokeOpacity={0.75}
          fill="url(#gradient)"
          fillOpacity={0.5}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
