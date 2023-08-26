"use server";

export const checkAuth = async (key: string): Promise<boolean> => {
  return Promise.resolve(process.env.CLIENT_KEY == key);
};