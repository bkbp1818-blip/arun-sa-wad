// MapProvider is no longer needed with Leaflet/OpenStreetMap (free, no API key required)
// Kept as a pass-through for backward compatibility
export function MapProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
