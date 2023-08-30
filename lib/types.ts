interface SummaryCardProps {
  title: string;
  value: string;
  text: string;
  children?: React.ReactNode;
}

interface TransactionDetails {
  id: number;
  name: string;
  category: string;
  amount: number;
  currency: string;
  createdAt: Date;
}

interface ChartData {
  name: string;
  total: number;
}

export type { SummaryCardProps, TransactionDetails, ChartData };
