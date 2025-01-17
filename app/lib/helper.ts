import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export enum CURRENCY_SIGNS {
  USD = "USD",
  PKR = "PKR",
}

export const convertCurrencySign = (sign: CURRENCY_SIGNS): string => {
  switch (sign) {
    case CURRENCY_SIGNS.USD:
      return "$";

    case CURRENCY_SIGNS.PKR:
      return "₨";

    default:
      throw new Error("Invalid currency sign");
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getThreeMonthsLaterDate() {
  const currentDate = new Date();
  const threeMonthsLater = new Date(currentDate);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  return threeMonthsLater.toISOString();
}
