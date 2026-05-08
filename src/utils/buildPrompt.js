const RESTRICTED_REPLY =
  'I can only answer questions related to the ISS dashboard and news data currently available.';

export function isDashboardQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  const allowedWords = [
    'iss',
    'space',
    'astronaut',
    'crew',
    'latitude',
    'longitude',
    'speed',
    'location',
    'orbit',
    'news',
    'article',
    'headline',
    'source',
    'summary',
    'technology',
    'dashboard'
  ];

  return allowedWords.some((word) => lowerQuestion.includes(word));
}

export function getRestrictedReply() {
  return RESTRICTED_REPLY;
}

export function buildPrompt(question, dashboardData) {
  const articleLines = dashboardData.newsArticles
    .slice(0, 10)
    .map(
      (article, index) =>
        `${index + 1}. Title: ${article.title}\nSource: ${article.source}\nSummary: ${article.description}`
    )
    .join('\n\n');

  const astronautNames = dashboardData.astronauts.map((person) => person.name).join(', ');

  return `<s>[INST]
You are a dashboard assistant.
Only answer using the provided dashboard data.
Do not use general internet knowledge.
Do not guess or invent facts.
If the user asks about anything outside the dashboard data, reply exactly:
"${RESTRICTED_REPLY}"
If information is unavailable, say:
"I do not have that information in the dashboard data."

Dashboard Data:
ISS Location:
Latitude: ${dashboardData.issPosition?.lat ?? 'Not available'}
Longitude: ${dashboardData.issPosition?.lng ?? 'Not available'}
Nearest Location: ${dashboardData.locationName || 'Not available'}

ISS Speed:
${dashboardData.issPosition?.speed ? Math.round(dashboardData.issPosition.speed) : 'Not available'} km/h

Astronauts:
${astronautNames || 'No astronaut data available'}

News Article Count:
${dashboardData.newsArticles.length}

News Headlines:
${articleLines || 'No news articles available'}

User Question:
${question}
[/INST]`;
}
