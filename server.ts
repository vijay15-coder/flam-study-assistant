import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const MIN_GENERATED_CARDS = 20;

app.use(express.json({ limit: '1mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in environment variables.');
}

app.post('/api/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { input } = req.body;
    const simulate = (req.query.simulate as string) || (req.headers['x-simulation'] as string);

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      res.status(400).json({
        error: 'Study topic or notes are required. Please provide non-empty text.',
      });
      return;
    }

    const trimmedInput = input.trim();

    if (simulate === 'slow') {
      await new Promise((resolve) => setTimeout(resolve, 3500));
    } else if (simulate === 'invalid_json') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send('{ "cards": [ { "question": "Incomplete json..." ');
      return;
    } else if (simulate === 'wrong_shape') {
      res.json({ title: 'Binary Search', summary: 'This is not a cards array', topics: [] });
      return;
    } else if (simulate === 'empty_cards') {
      res.json({ cards: [] });
      return;
    } else if (simulate === 'missing_question') {
      res.json({
        cards: [
          { answer: 'This card is missing its question attribute entirely.' },
        ],
      });
      return;
    } else if (simulate === 'missing_answer') {
      res.json({
        cards: [
          { question: 'What is binary search?', answer: '' },
        ],
      });
      return;
    } else if (simulate === 'server_error') {
      res.status(500).json({ error: 'Simulated internal server error (HTTP 500).' });
      return;
    }

    if (!aiClient) {
      res.status(503).json({
        error: 'Gemini API key is not configured on the server. Please check GEMINI_API_KEY.',
      });
      return;
    }

    const prompt = `You are a tutor and study assistant. Create a useful set of study flashcards for the following topic or notes:

"""
${trimmedInput}
"""

Guidelines:
- Generate 20 to 30 focused, high-impact flashcards.
- Cover the topic broadly with distinct definitions, mechanisms, comparisons, examples, edge cases, applications, and common misconceptions.
- Each "question" must be a direct question, term, scenario, or active recall prompt.
- Each "answer" must be a clear, concise, accurate explanation or solution.
- Avoid duplicate concepts.
- Never return fewer than 20 cards.`;

    const modelConfig = {
      systemInstruction:
        'You are a high-performance educational study deck generator. You strictly output valid JSON adhering to the provided schema with no markdown formatting or commentary.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cards: {
            type: Type.ARRAY,
            description: 'A collection of active recall flashcards.',
            items: {
              type: Type.OBJECT,
              properties: {
                question: {
                  type: Type.STRING,
                  description: 'The front question or concept prompt for the flashcard.',
                },
                answer: {
                  type: Type.STRING,
                  description: 'The concise, accurate explanation or answer on the back.',
                },
              },
              required: ['question', 'answer'],
            },
          },
        },
        required: ['cards'],
      },
    };

    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.6-flash', 'gemini-3.1-flash-lite'];
    let rawText: string | undefined;
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: modelConfig,
        });
        rawText = response.text;
        if (rawText) {
          console.log(`Successfully generated flashcards using ${modelName}`);
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Model ${modelName} returned error, trying fallback...`, (err as Error)?.message || err);
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    if (!rawText) {
      throw lastError || new Error('Empty response received from AI model.');
    }

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(rawText.trim());
    } catch (parseError) {
      console.error('Failed to parse AI JSON response:', rawText);
      res.status(502).json({
        error: 'AI response was not valid JSON.',
        details: (parseError as Error).message,
        raw: rawText,
      });
      return;
    }

    if (
      typeof parsedData !== 'object' ||
      parsedData === null ||
      Array.isArray(parsedData) ||
      !Array.isArray((parsedData as Record<string, unknown>).cards) ||
      ((parsedData as Record<string, unknown>).cards as unknown[]).length === 0
    ) {
      res.status(502).json({
        error: 'AI returned an empty or invalid flashcard collection. Please try generating the deck again.',
      });
      return;
    }

    const parsedCards = (parsedData as Record<string, unknown>).cards as Array<Record<string, unknown>>;
    if (parsedCards.length < MIN_GENERATED_CARDS) {
      res.status(502).json({
        error: `AI returned only ${parsedCards.length} flashcards. At least ${MIN_GENERATED_CARDS} distinct cards are required. Please try again.`,
      });
      return;
    }

    res.json(parsedData);
  } catch (error: unknown) {
    console.error('Error generating flashcards:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      error: 'Failed to generate flashcards due to a server error.',
      details: errorMessage,
    });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
