// src/utils/format.ts
export const SUI_DECIMALS = 9; // SUI uses 9 decimal places (Mist units)

export const formatBalance = (balance: string | number, decimals: number): string => {
  try {
    const balanceNum = Number(balance);
    if (isNaN(balanceNum)) return "0";
    return (balanceNum / Math.pow(10, decimals)).toFixed(2);
  } catch (error) {
    console.error("Error formatting balance:", error);
    return "0";
  }
};