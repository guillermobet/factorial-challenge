import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = (currency: string | null) =>
  new Intl.NumberFormat("es-ES", {
    ...(currency && { style: "currency", currency }),
    useGrouping: true,
  });

const bigAmountFormatter: (n: number) => string = (n: number) => {
  if (n < 0) {
    return "-" + bigAmountFormatter(-1 * n);
  } else {
    if (n < 1000) {
      return n.toString();
    } else if (n >= 1000 && n < 1_000_000) {
      return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    } else if (n >= 1_000_000 && n < 1_000_000_000) {
      return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (n >= 1_000_000_000 && n < 1_000_000_000_000) {
      return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else {
      return (n / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    }
  }
};

// Workaround to format whole numbers (e.g. 1000 -> 1.500)
const numberFormatter = (n: number) =>
  Number((Math.round(n * 100) / 100).toFixed(2)).toLocaleString("de-DE");

const getMonthByNumber: (m: number) => string = (m: number) => {
  switch (m) {
    case 1: {
      return "Jan";
    }
    case 2: {
      return "Feb";
    }
    case 3: {
      return "Mar";
    }
    case 4: {
      return "Apr";
    }
    case 5: {
      return "May";
    }
    case 6: {
      return "Jun";
    }
    case 7: {
      return "Jul";
    }
    case 8: {
      return "Aug";
    }
    case 9: {
      return "Sep";
    }
    case 10: {
      return "Oct";
    }
    case 11: {
      return "Nov";
    }
    case 12: {
      return "Dec";
    }
    default: {
      return "?";
    }
  }
};

export {
  cn,
  currencyFormatter,
  numberFormatter,
  bigAmountFormatter,
  getMonthByNumber,
};
