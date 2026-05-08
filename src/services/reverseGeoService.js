const REVERSE_GEO_URL = 'https://nominatim.openstreetmap.org/reverse';

export async function getLocationName(lat, lng) {
  try {
    const url = `${REVERSE_GEO_URL}?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    const address = data.address || {};

    return (
      address.city ||
      address.town ||
      address.village ||
      address.state ||
      address.country ||
      data.display_name ||
      'Over ocean / remote area'
    );
  } catch {
    return 'Over ocean / remote area';
  }
}
