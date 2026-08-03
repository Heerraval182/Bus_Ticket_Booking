const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function parseModelOutput(content) {
  if (!content) {
    return {
      sentiment: 'neutral',
      tags: [],
      urgent: false,
    };
  }

  const trimmedContent = String(content).trim();
  const jsonMatch = trimmedContent.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    return {
      sentiment: 'neutral',
      tags: [],
      urgent: false,
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      sentiment: parsed.sentiment || 'neutral',
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      urgent: Boolean(parsed.urgent),
    };
  } catch (error) {
    return {
      sentiment: 'neutral',
      tags: [],
      urgent: false,
    };
  }
}

async function analyzeFeedback(feedbackText) {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'user',
        content: feedbackText,
      },
    ],
    temperature: 0,
  });

  const content = response.choices?.[0]?.message?.content;

  return parseModelOutput(content);
}

module.exports = {
  analyzeFeedback,
};