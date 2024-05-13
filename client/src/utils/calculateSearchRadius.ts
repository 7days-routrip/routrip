export const calculateSearchRadius = (zoomLevel: number): number => {
  switch (true) {
    case zoomLevel < 10:
      return 50000; // 약 50km
    case zoomLevel < 15:
      return 30000; // 약 30km
    default:
      return 10000; // 약 10km
  }
};
