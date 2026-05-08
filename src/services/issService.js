const ISS_API_URL = 'http://api.open-notify.org/iss-now.json';

function createFallbackISSPosition() {
  const now = Date.now();
  const orbitPeriodMs = 92.68 * 60 * 1000;
  const orbitProgress = (now % orbitPeriodMs) / orbitPeriodMs;

  // This fallback is only used if the public API cannot be reached.
  return {
    lat: Math.sin(orbitProgress * Math.PI * 2) * 51.6,
    lng: orbitProgress * 360 - 180,
    timestamp: now,
    isFallback: true
  };
}

export async function getISSLocation() {
  try {
    const response = await fetch(ISS_API_URL);

    if (!response.ok) {
      throw new Error('ISS API response was not successful');
    }

    const data = await response.json();

    return {
      lat: Number(data.iss_position.latitude),
      lng: Number(data.iss_position.longitude),
      timestamp: Number(data.timestamp) * 1000,
      isFallback: false
    };
  } catch {
    return createFallbackISSPosition();
  }
}
