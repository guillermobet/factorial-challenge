export const checkAuth = (providedKey: string): boolean => {
  console.log(providedKey, process.env.CLIENT_KEY, providedKey === process.env.CLIENT_KEY)
  return providedKey === process.env.CLIENT_KEY;
};