const ASTRONAUT_API_URL = 'http://api.open-notify.org/astros.json';

const FALLBACK_ASTRONAUTS = [
  { name: 'Astronaut data temporarily unavailable', craft: 'Retry later' }
];

export async function getAstronauts() {
  try {
    const response = await fetch(ASTRONAUT_API_URL);

    if (!response.ok) {
      throw new Error('Astronaut API response was not successful');
    }

    const data = await response.json();
    return Array.isArray(data.people) ? data.people : [];
  } catch {
    return FALLBACK_ASTRONAUTS;
  }
}
