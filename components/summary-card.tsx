import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersLogo } from "@/components/svg/users-logo";

type Props = {
  title: string;
  value: string;
  text: string;
  children: React.ReactNode;
};

export function SummaryCard({ title, value, text, children }: Props) {
  return (
    <ShadcnCard className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{text}</p>
      </CardContent>
    </ShadcnCard>
  );
}
