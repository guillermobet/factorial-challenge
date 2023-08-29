"use client";

import { ChartData } from "@/lib/types";
import { bigAmountFormatter, currencyFormatter } from "@/lib/utils";
import {
  Bar,
  BarChart as RechartsBC,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  chartValues: any;
  formattingUnit?: string;
};

export function BarChart({ chartValues, formattingUnit }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBC data={chartValues}>
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
        <Tooltip
          cursor={false}
          contentStyle={{
            borderRadius: 8,
            borderColor: "black",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
          }}
          formatter={(value: number) =>
            `${currencyFormatter(null).format(value)}${formattingUnit || ""}`
          }
        />
      </RechartsBC>
    </ResponsiveContainer>
  );
}
