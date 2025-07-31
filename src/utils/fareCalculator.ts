export const calculateFare = (distanceKm: number): number => {
  const ratePerKm = 10;
  return distanceKm * ratePerKm;
};
