export const calculateSearchRadius = (zoomLevel: number): number => {
  switch (true) {
    case zoomLevel < 7:
      return 50000; // 약 50km
    case zoomLevel < 10:
      return 30000; // 약 30km
    case zoomLevel < 15:
      return 10000; // 약 10km
    default:
      return 5000; // 약 5km
  }
};
