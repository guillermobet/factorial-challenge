import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const revalidate: number = 10; // revalidate the data at most every ten seconds

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

  todayMidnight.setHours(0, 0, 0, 0);

  return prisma.user.count({
    where: {
      createdAt: {
        gte: todayMidnight, // Today at 00:00 UTC
        lt: now, // Today now
      },
    },
  });
});

export { getTotalUsers, getNewUsersCountToday };
