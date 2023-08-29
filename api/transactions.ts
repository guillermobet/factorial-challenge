import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { cache } from "react";

export const revalidate: number = 3600; // revalidate the data at most every hour

const getAggregatedTransactionsAmountInLast30Days: () => Promise<number> =
  cache(async () => {
    const date = new Date();
    const thirtyDaysAgoMidnightUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    );

    const thirtyDaysAgo = new Date(thirtyDaysAgoMidnightUTC);
    const now = new Date();

    thirtyDaysAgo.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = (
      await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: thirtyDaysAgo, // 30 days ago at 00:00 UTC
            lt: now, // Today now
          },
        },
      })
    )._sum;

    return result.amount ? result.amount.toNumber() : 0;
  });

const getAggregatedTransactionsAmountInPrevious30Days: () => Promise<number> =
  cache(async () => {
    const date = new Date();
    const sixtyDaysAgoMidnightUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    );
    const thirtyDaysAgoMidnightUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    );

    const sixtyDaysAgo = new Date(sixtyDaysAgoMidnightUTC);
    const thirtyDaysAgo = new Date(thirtyDaysAgoMidnightUTC);

    sixtyDaysAgo.setHours(0, 0, 0, 0);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    thirtyDaysAgo.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = (
      await prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          createdAt: {
            gte: sixtyDaysAgo, // 60 days ago at 00:00 UTC
            lt: thirtyDaysAgo, // 30 days ago at 00:00 UTC
          },
        },
      })
    )._sum;

    return result.amount ? result.amount.toNumber() : 0;
  });

const getMostRecentTransactions: (n: number) => Promise<
  {
    amount: Decimal;
    currency: string;
    category: string;
    User: {
      name: string;
    };
  }[]
> = cache(async (n: number) => {
  return await prisma.transaction.findMany({
    select: {
      amount: true,
      currency: true,
      category: true,
      User: {
        select: {
          name: true,
        },
      },
    },
    take: n,
    orderBy: {
      createdAt: "desc",
    },
  });
});

const getAverageSpendingLast30Days: () => Promise<any> = cache(async () => {
  const date = new Date();
  const thirtyDaysAgoMidnightUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );

  const thirtyDaysAgo = new Date(thirtyDaysAgoMidnightUTC);
  const now = new Date();

  thirtyDaysAgo.setHours(0, 0, 0, 0);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const avgPerUser = await prisma.transaction.groupBy({
    by: ["userId"],
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
        lt: now,
      },
    },
    _avg: {
      amount: true,
    },
  });

  return (
    avgPerUser.reduce(
      (acc, currentUser) => acc + currentUser._avg.amount!.toNumber(),
      0
    ) / avgPerUser.length
  );
});

const getAverageSpendingPrevious30Days: () => Promise<number> = cache(
  async () => {
    const date = new Date();
    const sixtyDaysAgoMidnightUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    );
    const thirtyDaysAgoMidnightUTC = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    );

    const sixtyDaysAgo = new Date(sixtyDaysAgoMidnightUTC);
    const thirtyDaysAgo = new Date(thirtyDaysAgoMidnightUTC);

    sixtyDaysAgo.setHours(0, 0, 0, 0);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    thirtyDaysAgo.setHours(0, 0, 0, 0);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const avgPerUser = await prisma.transaction.groupBy({
      by: ["userId"],
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      _avg: {
        amount: true,
      },
    });

    return (
      avgPerUser.reduce(
        (acc, currentUser) => acc + currentUser._avg.amount!.toNumber(),
        0
      ) / avgPerUser.length
    );
  }
);

const getTrasactionVolumePerMonthLast12Months: () => Promise<
  {
    year: number;
    month: number;
    total: Decimal;
  }[]
> = cache(async () => {
  return await prisma.$queryRaw(Prisma.sql`
    SELECT  YEAR(createdAt) as year,
            MONTH(createdAt) as month,
            SUM(amount) AS total
    FROM Transaction
    GROUP BY year, month
    ORDER BY year, month`);
});

export {
  getAggregatedTransactionsAmountInLast30Days,
  getAggregatedTransactionsAmountInPrevious30Days,
  getMostRecentTransactions,
  getAverageSpendingLast30Days,
  getAverageSpendingPrevious30Days,
  getTrasactionVolumePerMonthLast12Months,
};
