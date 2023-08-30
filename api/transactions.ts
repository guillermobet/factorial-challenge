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

const getAverageSpendingLast30Days: () => Promise<number> = cache(async () => {
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

const getTransactionVolumePerCategoryLast30Days: () => Promise<
  { name: string; total: number; count: number }[]
> = cache(async () => {
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

  const transactionsPerCategory = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
        lt: now,
      },
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const result = transactionsPerCategory.map((row) => {
    return {
      name: row.category,
      total: row._sum.amount!.toNumber(),
      count: row._count,
    };
  });

  return result;
});

const getTrasactionVolumePerHourLastWeek: () => Promise<
  {
    hour: number;
    total: number;
  }[]
> = cache(async () => {
  const date = new Date();
  const yesterdayUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );
  const sevenDaysAgoMidnightUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );

  const yesterday = new Date(yesterdayUTC);
  const sevenDaysAgo = new Date(sevenDaysAgoMidnightUTC);
  const now = new Date();

  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getDate() - 1);

  const result = (await prisma.$queryRaw(Prisma.sql`
    SELECT  HOUR(createdAt) as hour, SUM(amount) as total
    FROM Transaction
    WHERE createdAt > ${sevenDaysAgo} AND createdAt <= ${now}
    GROUP BY hour
    ORDER BY hour ASC`)) as { hour: number; total: Decimal }[];

  return result.map((row: { hour: number; total: Decimal }) => {
    return {
      hour: row.hour,
      total: row.total.toNumber(),
    };
  });
});

const getTopOfCategoryRankingLast7Days: (order: string) => Promise<{
  name: string;
  total: number;
}> = cache(async (order: string) => {
  const date = new Date();
  const sevenDaysAgoMidnightUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );

  const sevenDaysAgo = new Date(sevenDaysAgoMidnightUTC);
  const now = new Date();

  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const transactionsPerCategory = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      createdAt: {
        gte: sevenDaysAgo,
        lt: now,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: order as Prisma.SortOrder,
      },
    },
    take: 1,
  });

  const result = transactionsPerCategory.map((row) => {
    return {
      name: row.category,
      total: row._sum.amount!.toNumber(),
    };
  });

  return result[0];
});

const getSortedTransctionsLast7Days: (order: string) => Promise<{
  name: string;
  amount: number;
}> = cache(async (order: string) => {
  const date = new Date();
  const sevenDaysAgoMidnightUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );

  const sevenDaysAgo = new Date(sevenDaysAgoMidnightUTC);
  const now = new Date();

  sevenDaysAgo.setHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const sortedTransactions = await prisma.transaction.findFirst({
    select: {
      amount: true,
      category: true,
    },
    where: {
      createdAt: {
        gte: sevenDaysAgo,
        lt: now,
      },
    },

    orderBy: {
      amount: order as Prisma.SortOrder,
    },
    take: 1,
  });

  const result = {
    name: sortedTransactions!.category,
    amount: sortedTransactions!.amount.toNumber(),
  };

  return result;
});

export {
  getAggregatedTransactionsAmountInLast30Days,
  getAggregatedTransactionsAmountInPrevious30Days,
  getMostRecentTransactions,
  getAverageSpendingLast30Days,
  getAverageSpendingPrevious30Days,
  getTrasactionVolumePerMonthLast12Months,
  getTransactionVolumePerCategoryLast30Days,
  getTrasactionVolumePerHourLastWeek,
  getTopOfCategoryRankingLast7Days,
  getSortedTransctionsLast7Days,
};
