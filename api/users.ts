import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const revalidate: number = 3600; // revalidate the data at most every hour

const getTotalUsers: () => Promise<number> = cache(async () => {
  return await prisma.user.count();
});

const getNewUsersCountToday: () => Promise<number> = cache(async () => {
  const date = new Date();
  const todayMidnightUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0,
    0,
    0
  );

  const todayMidnight = new Date(todayMidnightUTC);
  const now = new Date();

  return prisma.user.count({
    where: {
      createdAt: {
        gte: todayMidnight, // Today at 00:00 UTC
        lt: now, // Today now
      },
    },
  });
});

const getNewUsersCountLast30Days: () => Promise<number> = cache(async () => {
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

  return prisma.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo, // 30 days ago at 00:00 UTC
        lt: now, // Today now
      },
    },
  });
});

const getNewUsersCountPrevious30Days: () => Promise<number> = cache(
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

    return prisma.user.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo, // 60 days ago at 00:00 UTC
          lt: thirtyDaysAgo, // 30 days ago at 00:00 UTC
        },
      },
    });
  }
);

export {
  getTotalUsers,
  getNewUsersCountToday,
  getNewUsersCountLast30Days,
  getNewUsersCountPrevious30Days,
};
