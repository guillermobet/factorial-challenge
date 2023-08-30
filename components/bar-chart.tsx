"use client";

import { ChartData } from "@/lib/types";
import { bigAmountFormatter, currencyFormatter } from "@/lib/utils";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  chartValues: ChartData[];
  formattingUnit?: string;
};

const CustomTooltip = ({ active, payload, value }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/[.75] rounded-lg border-black p-4 gap-1">
        <div className="flex flex-row justify-between items-baseline text-lg font-bold">
          <p className="pb-2">{`${payload[0].payload.name}`}</p>
          <span>🗓️</span>
        </div>
        <p className="text-xs">{`Total: ${currencyFormatter("EUR").format(
          payload[0].value
        )}`}</p>
      </div>
    );
  }
  return null;
};

export function BarChart({ chartValues }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={chartValues as any}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => `${bigAmountFormatter(value)} €`}
        />
        <Bar dataKey="total" fill="#103FEF" radius={[4, 4, 4, 4]} />
        <Tooltip cursor={false} content={<CustomTooltip />} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
