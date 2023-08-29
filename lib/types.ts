interface CardProps {
  title: string;
  value: string;
  text: string;
  logo?: React.ReactNode;
}

interface TransactionDetails {
  id: number;
  name: string;
  category: string;
  amount: number;
  currency: string;
}

interface ChartData {
  name: string;
  total: number;
}

export type { CardProps, TransactionDetails, ChartData };
