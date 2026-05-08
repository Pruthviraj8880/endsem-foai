function calculateSpeed(pos1, pos2, timeDiffSeconds) {
  // R is the average radius of Earth in kilometers.
  const R = 6371;

  // Convert degrees into radians because trigonometry functions use radians.
  const toRad = (deg) => deg * (Math.PI / 180);

  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng);

  // Haversine formula: calculates distance between two latitude/longitude points.
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  // Speed = distance / time. We multiply by 3600 to convert seconds into hours.
  const speedKmh = (distance / timeDiffSeconds) * 3600;

  return speedKmh;
}

export default calculateSpeed;
