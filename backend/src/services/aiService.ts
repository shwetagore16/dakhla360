import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAssetSummary = async (asset: any, reviews: any[]): Promise<any> => {
  try {
    const prompt = `You are an AI assistant for Dakhla360, a blockchain-based asset verification platform.
Analyze this asset and provide a concise summary for a potential buyer.

Asset Data:
- Name: ${asset.name}
- Type: ${asset.type}
- Description: ${asset.description || 'No description'}
- Trust Score: ${asset.trustScore}/100
- Verified: ${asset.isVerified}
- Status: ${asset.status}
- Location: ${asset.location?.city}, ${asset.location?.country}
- Total Reviews: ${reviews.length}
- Average Rating: ${reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : 'No reviews'}
- Ownership History Count: ${asset.ownershipHistory?.length || 1}

Respond ONLY with a valid JSON object, no markdown, no explanation:
{
  "summary": "2-3 sentence overview",
  "keyHighlights": ["highlight1", "highlight2", "highlight3"],
  "redFlags": ["flag1"] or [],
  "buyerAdvice": "1-2 sentence advice",
  "confidenceLevel": "high" or "medium" or "low"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (error: any) {
    throw new Error('AI summary failed: ' + error.message);
  }
};

export const explainTrustScore = async (asset: any, reviews: any[]): Promise<string> => {
  try {
    const prompt = `Explain this asset's trust score in simple, friendly language in under 80 words.
Asset: ${asset.name}
Trust Score: ${asset.trustScore}/100
Reviews: ${reviews.length}
Verified: ${asset.isVerified}
Status: ${asset.status}
Be direct and helpful. No markdown.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content || 'Unable to explain score.';
  } catch (error: any) {
    throw new Error('AI explanation failed: ' + error.message);
  }
};

export const detectFraud = async (asset: any, reviews: any[], issues: any[]): Promise<any> => {
  try {
    const prompt = `Analyze this asset for potential fraud indicators.

Asset: ${asset.name} (${asset.type})
Trust Score: ${asset.trustScore}/100
Status: ${asset.status}
Open Issues: ${issues.filter((i: any) => i.status === 'open').length}
Fraud/Stolen Issues: ${issues.filter((i: any) => ['fraud', 'stolen'].includes(i.type)).length}
Total Reviews: ${reviews.length}
Disputed: ${asset.status === 'disputed'}

Respond ONLY with valid JSON, no markdown:
{
  "riskLevel": "low" or "medium" or "high",
  "indicators": ["indicator1"] or [],
  "recommendation": "brief recommendation"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (error: any) {
    throw new Error('Fraud detection failed: ' + error.message);
  }
};