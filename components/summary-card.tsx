import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SummaryCardProps } from "@/lib/types";

export function SummaryCard({
  title,
  value,
  text,
  children,
}: SummaryCardProps) {
  return (
    <ShadcnCard className="flex flex-col justify-between w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {text && <p className="text-xs text-muted-foreground">{text}</p>}
      </CardContent>
    </ShadcnCard>
  );
}
