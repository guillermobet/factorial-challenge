import { BarChart } from "@/components/bar-chart";
import { SummaryCard } from "@/components/summary-card";
import { DetailsCard } from "@/components/details-card";

import {
  currencyFormatter,
  getMonthByNumber,
  numberFormatter,
} from "@/lib/utils";

import {
  getTotalUsers,
  getNewUsersCountToday,
  getNewUsersCountLast30Days,
  getNewUsersCountPrevious30Days,
} from "@/api/users";
import {
  getAggregatedTransactionsAmountInLast30Days,
  getAggregatedTransactionsAmountInPrevious30Days,
  getMostRecentTransactions,
  getAverageSpendingLast30Days,
  getAverageSpendingPrevious30Days,
  getTrasactionVolumePerMonthLast12Months,
} from "@/api/transactions";

import { SummaryCardProps, TransactionDetails, ChartData } from "@/lib/types";

export const revalidate: number = 3600; // revalidate the data at most every hour

export default async function Overview() {
  const newUsersSinceYesterday: () => Promise<string> = async () => {
    const count: number = await getNewUsersCountToday();
    return count > 0
      ? `+${numberFormatter(count)} new user${count > 1 ? "s" : ""} today`
      : "No new users today yet";
  };

  const newUsersLast30Days: () => Promise<string> = async () => {
    const count: number = await getNewUsersCountLast30Days();
    return count > 0
      ? `+${numberFormatter(count)} user${count > 1 ? "s" : ""}`
      : "No new users today yet";
  };

  const newUsersPrevious30Days: () => Promise<string> = async () => {
    const countPrevious30Days: number = await getNewUsersCountPrevious30Days();
    const countLast30Days: number = await getNewUsersCountLast30Days();
    const result = countLast30Days - countPrevious30Days;
    return result !== 0
      ? `${
          result > 0 ? `+${numberFormatter(result)}` : numberFormatter(result)
        } user${
          Math.abs(result) > 1 || result === 0 ? "s" : ""
        } compared to previous 30 days`
      : "Same as in the previous 30 days";
  };

  const totalMoneyInTransactionsLast30Days: () => Promise<number> =
    async () => {
      return await getAggregatedTransactionsAmountInLast30Days();
    };

  const percentageRevenueGrowth: () => Promise<string> = async () => {
    const transactionVolumeLast30Days =
      await getAggregatedTransactionsAmountInLast30Days();
    const transactionVolumePrevious30Days =
      await getAggregatedTransactionsAmountInPrevious30Days();

    const result =
      (transactionVolumeLast30Days * 100) / transactionVolumePrevious30Days -
      100;

    if (transactionVolumePrevious30Days === 0) {
      return "+100% from the previous 30 days";
    } else {
      return result !== 0
        ? `${
            result > 0
              ? `+${numberFormatter(result)}%`
              : numberFormatter(result)
          } from the previous 30 days`
        : "About the same as in the previous 30 days";
    }
  };

  const percentageAverageSpendingGrowth: () => Promise<string> = async () => {
    const averageSpendingLast30Days = await getAverageSpendingLast30Days();
    const averageSpendingPrevious30Days =
      await getAverageSpendingPrevious30Days();

    const result =
      (averageSpendingLast30Days * 100) / averageSpendingPrevious30Days - 100;

    if (averageSpendingPrevious30Days === 0) {
      return "+100% from the previous 30 days";
    } else {
      return result !== 0
        ? `${
            result > 0
              ? `+${numberFormatter(result)}%`
              : numberFormatter(result)
          } from the previous 30 days`
        : "About the same as in the previous 30 days";
    }
  };

  const getRecentTransactions: (n: number) => Promise<
    {
      id: number;
      name: string;
      category: string;
      amount: number;
      currency: string;
    }[]
  > = async (n: number) => {
    const result = await getMostRecentTransactions(5);
    return result.map((row, index) => {
      return {
        id: index,
        name: row.User.name,
        category: row.category,
        amount: row.amount.toNumber(),
        currency: row.currency,
      };
    });
  };

  const summaryCardsData: SummaryCardProps[] = [
    {
      title: "Total users registered",
      value: `${numberFormatter(await getTotalUsers())} users`,
      text: await newUsersSinceYesterday(),
      children: "👤",
    },
    {
      title: "Users registered (30 days)",
      value: await newUsersLast30Days(),
      text: await newUsersPrevious30Days(),
      children: "📈",
    },
    {
      title: "Total in transactions (30 days)",
      value: currencyFormatter("EUR").format(
        await totalMoneyInTransactionsLast30Days()
      ),
      text: await percentageRevenueGrowth(),
      children: "💶",
    },
    {
      title: "Average user spending (30 days)",
      value: currencyFormatter("EUR").format(
        await getAverageSpendingLast30Days()
      ),
      text: await percentageAverageSpendingGrowth(),
      children: "💳",
    },
  ];

  const recentTransactions: TransactionDetails[] = await getRecentTransactions(
    5
  );

  const chartData: () => Promise<ChartData[]> = async () => {
    const result = await getTrasactionVolumePerMonthLast12Months();
    return result.map((row) => {
      return {
        name: `${getMonthByNumber(row.month)} '${row.year
          .toString()
          .slice(-2)}`,
        total: row.total.toNumber(),
      } as ChartData;
    });
  };

  return (
    <>
      <div className="flex-1 flex flex-col justify-center gap-12">
        <div className="flex flex-row justify-center gap-8">
          {summaryCardsData.map(({ children, ...props }: SummaryCardProps) => {
            return (
              <SummaryCard {...props} key={props.title}>
                {children}
              </SummaryCard>
            );
          })}
        </div>
        <div className="flex-1 flex flex-row gap-16">
          <div className="flex flex-col w-2/3 gap-16">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium leading-none">
                Transactions overview
              </p>
              <p className="text-xs text-gray-500">(last 12 months)</p>
            </div>
            <BarChart chartValues={await chartData()} />
          </div>
          <DetailsCard
            title="Recent transactions"
            text="Most recent transactions are shown"
            className="w-1/3"
          >
            <div className="space-y-8">
              {recentTransactions.map(
                ({
                  id,
                  name,
                  category,
                  amount,
                  currency,
                }: TransactionDetails) => {
                  return (
                    <div className="flex items-center" key={id}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {amount > 0 ? "+" : amount < 0 ? "-" : ""}
                        {currencyFormatter(currency).format(amount)}
                      </div>
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
