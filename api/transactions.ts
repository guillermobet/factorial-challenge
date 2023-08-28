import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const revalidate: number = 10; // revalidate the data at most every ten seconds

const getTotalUsers: () => Promise<number> = cache(async () => {
  return await prisma.user.count();
});

const getAggregatedTransactionsAmountInLastMonth: () => Promise<number> = cache(
  async () => {
    const now = new Date();
    const thirtyDaysAgoMidnight = new Date(now);

    thirtyDaysAgoMidnight.setHours(0, 0, 0, 0);
    thirtyDaysAgoMidnight.setDate(thirtyDaysAgoMidnight.getDate() - 30);

    const result = (
      await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: thirtyDaysAgoMidnight, // Today at 00:00 UTC
            lt: now, // Today now
          },
        },
      })
    )["_sum"].amount!;

    if (result) {
      return result.toNumber();
    } else {
      return NaN;
    }
  }
);

export { getAggregatedTransactionsAmountInLastMonth };
