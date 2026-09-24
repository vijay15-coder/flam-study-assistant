import { GoogleGenAI, Type } from '@google/genai';

const MIN_GENERATED_CARDS = 20;

export default async function handler(req: any, res: any): Promise<void> {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed.' });
		return;
	}

	const input = req.body?.input;
	if (typeof input !== 'string' || input.trim().length === 0) {
		res.status(400).json({ error: 'Study topic or notes are required.' });
		return;
	}

	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		res.status(503).json({
			error: 'Gemini API key is not configured on the server. Add GEMINI_API_KEY in Vercel project settings.',
		});
		return;
	}

	const prompt = `You are a tutor and study assistant. Create a useful set of study flashcards for the following topic or notes:

"""
${input.trim()}
"""

Guidelines:
- Generate 20 to 30 focused, high-impact flashcards.
- Cover definitions, mechanisms, comparisons, examples, applications, and common misconceptions.
- Each question must be a direct question, term, scenario, or active recall prompt.
- Each answer must be a clear, concise, accurate explanation.
- Avoid duplicate concepts and never return fewer than 20 cards.`;

	const config = {
		systemInstruction:
			'You are a study deck generator. Return only valid JSON matching the provided schema.',
		responseMimeType: 'application/json',
		responseSchema: {
			type: Type.OBJECT,
			properties: {
				cards: {
					type: Type.ARRAY,
					items: {
						type: Type.OBJECT,
						properties: {
							question: { type: Type.STRING },
							answer: { type: Type.STRING },
						},
						required: ['question', 'answer'],
					},
				},
			},
			required: ['cards'],
		},
	};

	try {
		const ai = new GoogleGenAI({ apiKey });
		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt,
			config,
		});
		const rawText = response.text?.trim();
		if (!rawText) throw new Error('Empty response received from AI model.');

		const parsed = JSON.parse(rawText);
		if (!parsed || !Array.isArray(parsed.cards) || parsed.cards.length < MIN_GENERATED_CARDS) {
			res.status(502).json({
				error: `AI returned fewer than ${MIN_GENERATED_CARDS} valid flashcards. Please try again.`,
			});
			return;
		}

		res.status(200).json(parsed);
	} catch (error: any) {
		console.error('Vercel generation error:', error);
		res.status(500).json({
			error: 'Failed to generate flashcards due to a server error.',
			details: error?.message || 'Unknown server error.',
		});
	}
}