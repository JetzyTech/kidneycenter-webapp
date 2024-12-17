export enum CURRENCY_SIGNS {
  USD = 'USD',
  PKR = 'PKR'
}
  
export const convertCurrencySign = (sign: CURRENCY_SIGNS): string => {
  switch (sign) {
    case CURRENCY_SIGNS.USD:
      return '$';
  
    case CURRENCY_SIGNS.PKR:
      return '₨'; // Using the symbol for Pakistani Rupee
  
    default:
      throw new Error('Invalid currency sign');
  }
}