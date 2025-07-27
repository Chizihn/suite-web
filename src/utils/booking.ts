// Date utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Price utilities
export const calculateSubtotal = (
  basePrice: number,
  nights: number
): number => {
  return basePrice * nights;
};

export const calculateFees = (
  subtotal: number,
  feePercentage: number = 0.1
): number => {
  return Math.round(subtotal * feePercentage);
};

export const calculateDiscount = (
  subtotal: number,
  discountPercentage: number = 0.05
): number => {
  return Math.round(subtotal * discountPercentage);
};

export const calculateTotal = (
  subtotal: number,
  fees: number,
  discount: number
): number => {
  return subtotal + fees - discount;
};

// String utilities
export const truncateAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string => {
  if (!address) return "";
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Array utilities
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const groupBy = <T, K extends string>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};
