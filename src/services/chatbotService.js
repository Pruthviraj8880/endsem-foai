import { buildPrompt, getRestrictedReply, isDashboardQuestion } from '../utils/buildPrompt.js';

const HF_API_URL =
  'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

function createLocalAnswer(question, dashboardData) {
  const lowerQuestion = question.toLowerCase();

  if (!isDashboardQuestion(question)) {
    return getRestrictedReply();
  }

  if (lowerQuestion.includes('astronaut') || lowerQuestion.includes('crew')) {
    const names = dashboardData.astronauts.map((person) => person.name).join(', ');
    return names
      ? `The dashboard currently shows these astronauts: ${names}.`
      : 'I do not have that information in the dashboard data.';
  }

  if (lowerQuestion.includes('news') || lowerQuestion.includes('article') || lowerQuestion.includes('headline')) {
    const headlines = dashboardData.newsArticles
      .slice(0, 5)
      .map((article, index) => `${index + 1}. ${article.title}`)
      .join(' ');
    return headlines
      ? `The dashboard currently has ${dashboardData.newsArticles.length} news articles. ${headlines}`
      : 'I do not have that information in the dashboard data.';
  }

  if (
    lowerQuestion.includes('iss') ||
    lowerQuestion.includes('speed') ||
    lowerQuestion.includes('latitude') ||
    lowerQuestion.includes('longitude') ||
    lowerQuestion.includes('location')
  ) {
    const position = dashboardData.issPosition;
    if (!position) return 'I do not have that information in the dashboard data.';

    return `The ISS is at latitude ${position.lat.toFixed(4)}, longitude ${position.lng.toFixed(
      4
    )}, near ${dashboardData.locationName}, moving at about ${Math.round(position.speed).toLocaleString()} km/h.`;
  }

  return 'I do not have that information in the dashboard data.';
}

export async function askDashboardAI(question, dashboardData) {
  if (!isDashboardQuestion(question)) {
    return getRestrictedReply();
  }

  const hfApiKey = import.meta.env.VITE_HF_API_KEY;

  if (!hfApiKey || hfApiKey === 'your_huggingface_api_key_here') {
    return createLocalAnswer(question, dashboardData);
  }

  const prompt = buildPrompt(question, dashboardData);

  const response = await fetch(HF_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 220,
        temperature: 0.2,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    throw new Error('AI service temporarily unavailable.');
  }

  const data = await response.json();
  const text = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;

  return text?.trim() || 'I do not have that information in the dashboard data.';
}
