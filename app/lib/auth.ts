"use server";

export const checkAuth = async (key: string): Promise<boolean> => {
  return new Promise(() => {
    process.env.CLIENT_KEY === key;
  });
};