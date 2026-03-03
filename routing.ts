export interface RouteResult {
  coordinates: [number, number][];
  durationMinutes: number;
  distanceKm: number;
}

export async function fetchWalkingRoute(
  from: [number, number],
  to: [number, number]
): Promise<RouteResult | null> {
  const url = `https://router.project-osrm.org/route/v1/foot/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== 'Ok' || !data.routes?.length) return null;

    const route = data.routes[0];
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]]
    );

    return {
      coordinates,
      durationMinutes: Math.round(route.duration / 60),
      distanceKm: Math.round(route.distance / 100) / 10,
    };
  } catch {
    return null;
  }
}
