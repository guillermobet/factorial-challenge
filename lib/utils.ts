import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  useGrouping: true,
});

// Workaround to format whole numbers (e.g. 1000 -> 1.500)
export const numberFormatter = (n: number) => n.toLocaleString("de-DE");
