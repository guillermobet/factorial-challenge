import {
  getSortedTransctionsLast7Days,
  getTopOfCategoryRankingLast7Days,
  getTransactionVolumePerCategoryLast30Days,
  getTrasactionVolumePerHourLastWeek,
} from "@/api/transactions";
import { PieChart } from "@/components/pie-chart";
import { AreaChart } from "@/components/area-chart";
import { SummaryCardProps } from "@/lib/types";
import { SummaryCard } from "@/components/summary-card";
import { currencyFormatter } from "@/lib/utils";

export const revalidate: number = 3600; // revalidate the data at most every hour

export default async function Transactions() {
  const pieChartData = await getTransactionVolumePerCategoryLast30Days();

  const areaChartData = await getTrasactionVolumePerHourLastWeek();

  const { name: mostPopularCategory, total: mostPopularCategoryTotal } =
    await getTopOfCategoryRankingLast7Days("desc");

  const { name: leastPopularCategory, total: leastPopularCategoryTotal } =
    await getTopOfCategoryRankingLast7Days("asc");

  const { name: biggestTransactionCategory, amount: biggestTransactionAmount } =
    await getSortedTransctionsLast7Days("desc");

  const {
    name: smallestTransactionCategory,
    amount: smallestTransactionAmount,
  } = await getSortedTransctionsLast7Days("asc");

  const summaryCardsData: SummaryCardProps[] = [
    {
      title: "Most popular category (last 7 days)",
      value: mostPopularCategory,
      text: `${currencyFormatter("EUR").format(
        mostPopularCategoryTotal
      )} spent`,
      children: "⭐️",
    },
    {
      title: "Least popular category (last 7 days)",
      value: leastPopularCategory,
      text: `${currencyFormatter("EUR").format(
        leastPopularCategoryTotal
      )} spent`,
      children: "🙅🏻‍♂️",
    },
    {
      title: "Biggest transaction (7 days)",
      value: `${currencyFormatter("EUR").format(biggestTransactionAmount)}`,
      text: `in ${biggestTransactionCategory}`,
      children: "💰",
    },
    {
      title: "Smallest transaction (7 days)",
      value: `${currencyFormatter("EUR").format(smallestTransactionAmount)}`,
      text: `in ${smallestTransactionCategory}`,
      children: "🪙",
    },
  ];

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
          <div className="flex flex-col w-1/3 gap-16">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium leading-none">
                Transactions by category
              </p>
              <p className="text-xs text-gray-500">(last 30 days)</p>
            </div>
            <PieChart chartValues={pieChartData} />
          </div>
          <div className="flex flex-col w-2/3 gap-16">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium leading-none">
                Transactions by hour
              </p>
              <p className="text-xs text-gray-500">(last 7 days)</p>
            </div>
            <AreaChart chartValues={areaChartData} />
          </div>
        </div>
      </div>
    </>
  );
}
