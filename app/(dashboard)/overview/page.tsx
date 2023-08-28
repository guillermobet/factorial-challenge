import { BarChart } from "@/components/bar-chart";
import { SummaryCard } from "@/components/summary-card";
import { DetailsCard } from "@/components/details-card";

import { CardLogo } from "@/components/svg/card-logo";
import { CurrencyLogo } from "@/components/svg/currency-logo";
import { SignalLogo } from "@/components/svg/signal-logo";
import { UsersLogo } from "@/components/svg/users-logo";

import { currencyFormatter, numberFormatter } from "@/lib/utils";

import { getTotalUsers, getNewUsersCountToday } from "@/api/users";
import { getAggregatedTransactionsAmountInLastMonth } from "@/api/transactions";

interface CardProps {
  title: string;
  value: string;
  text: string;
  logo?: React.ReactNode;
}

interface TransactionDetails {
  id: number;
  name: string;
  email: string;
  amount: string;
}

const recentTransactions = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+1.999,00 €",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+39,00 €",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+299,00 €",
  },
  {
    id: 4,
    name: "William Kim",
    email: "william.kim@email.com",
    amount: "+99,00 €",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+19,00 €",
  },
];

interface ChartData {
  chartValues: {
    name: string;
    total: number;
  }[];
  formattingUnit: string;
}
const chartData: ChartData = {
  chartValues: [
    {
      name: "Sep '22",
      total: 100,
    },
    {
      name: "Oct '22",
      total: 200,
    },
    {
      name: "Nov '22",
      total: 300,
    },
    {
      name: "Dec '22",
      total: 250,
    },
    {
      name: "Jan '23",
      total: 100,
    },
    {
      name: "Feb '23",
      total: 200,
    },
    {
      name: "Mar '23",
      total: 300,
    },
    {
      name: "Apr '23",
      total: 250,
    },
    {
      name: "May '23",
      total: 100,
    },
    {
      name: "Jun '23",
      total: 200,
    },
    {
      name: "Jul '23",
      total: 300,
    },
    {
      name: "Aug '23",
      total: 250,
    },
  ],
  formattingUnit: "€",
};

export default async function Overview() {
  const newUsersSinceYesterday: () => Promise<string> = async () => {
    const count: number = await getNewUsersCountToday();
    return count > 0
      ? `+${count} new user${count > 1 ? "s" : ""} today`
      : "No new users today yet";
  };

  const totalMoneyInTransactionsLastMonth: () => Promise<number> = async () => {
    return await getAggregatedTransactionsAmountInLastMonth();
  };

  const percentageGrowthMoney = async () => {};

  const cardProps: CardProps[] = [
    {
      title: "Total users registered",
      value: numberFormatter(await getTotalUsers()),
      text: await newUsersSinceYesterday(),
      logo: <UsersLogo />,
    },
    {
      title: "Users registered (30 days)",
      value: "732 users",
      text: "+190% from last month",
      logo: <SignalLogo />,
    },
    {
      title: "Total in transactions (30 days)",
      value: currencyFormatter.format(
        await totalMoneyInTransactionsLastMonth()
      ),
      text: "+29.7% from last month",
      logo: <CurrencyLogo />,
    },
    {
      title: "Average spending (30 days)",
      value: "974,32 €",
      text: "+20.1% from last month",
      logo: <CardLogo />,
    },
  ];

  const { chartValues, formattingUnit } = chartData;

  return (
    <>
      <div className="flex flex-col gap-12">
        <div className="flex flex-row justify-center gap-8">
          {cardProps.map(({ logo, ...props }: CardProps) => {
            return (
              <SummaryCard {...props} key={props.title}>
                {logo}
              </SummaryCard>
            );
          })}
        </div>
        <div className="flex flex-row gap-16">
          <div className="flex flex-col w-4/6 gap-16">
            <p className="text-xl ml-4 font-medium leading-none">
              Transactions (last 12 months)
            </p>
            <BarChart
              chartValues={chartValues}
              formattingUnit={formattingUnit}
            />
          </div>
          <DetailsCard
            title="Recent transactions"
            text="Most recent transactions are shown"
            className="w-2/6"
          >
            <div className="space-y-8">
              {recentTransactions.map(
                ({ id, name, email, amount }: TransactionDetails) => {
                  return (
                    <div className="flex items-center" key={id}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {name}
                        </p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                      </div>
                      <div className="ml-auto font-medium">{amount}</div>
                    </div>
                  );
                }
              )}
            </div>
          </DetailsCard>
        </div>
      </div>
    </>
  );
}
