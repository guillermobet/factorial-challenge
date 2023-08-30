"use client";

import {
  bigAmountFormatter,
  currencyFormatter,
  numberFormatter,
} from "@/lib/utils";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  chartValues: any;
  formattingUnit?: string;
};

const colors = [
  "#1f3bb3",
  "#1b359f",
  "#182e8b",
  "#142877",
  "#112164",
  "#0e1a50",
  "#0a143c",
  "#070d28",
];

const categoriesEmoji: any = {
  "Shopping & Entertainment": "🛍️",
  Transportation: "🚌",
  Health: "🏥",
  Groceries: "🛒",
  "Restaurants & Dining": "🍽️",
  "Home & Utilities": "🏠",
  Insurance: "👨‍👩‍👧",
  Others: "➕",
};

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <>
      <text
        x={x}
        y={y}
        fontSize={12}
        fill="white"
        textAnchor={"middle"}
        dominantBaseline="central"
      >
        {`${categoriesEmoji[name]}: ${(percent * 100).toFixed(2)}%`}
      </text>
    </>
  );
};

const CustomTooltip = ({ active, payload, value }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col bg-black/[.90] rounded-lg border-black p-4 gap-1">
        <div className="flex flex-row justify-between items-baseline text-lg font-bold gap-4">
          <p className="pb-2">{`${payload[0].payload.name}`}</p>
          <span className="">{categoriesEmoji[payload[0].payload.name]}</span>
        </div>
        <p className="text-xs">{`Total revenue: ${currencyFormatter(
          "EUR"
        ).format(payload[0].value)}`}</p>
        <p className="text-xs">{`Number of transactions: ${numberFormatter(
          payload[0].payload.count
        )}`}</p>
      </div>
    );
  }
  return null;
};

export function PieChart({ chartValues, formattingUnit }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={chartValues}
          cx={"50%"}
          cy={"50%"}
          innerRadius={35}
          outerRadius={160}
          labelLine={false}
          label={<CustomLabel />}
          fill="#020817"
          dataKey="total"
          stroke="#020817"
          strokeWidth={5}
          width={100}
          height={100}
        >
          {chartValues.map((_: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              opacity={0.95}
            />
          ))}
        </Pie>
        <Tooltip cursor={false} content={<CustomTooltip />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
