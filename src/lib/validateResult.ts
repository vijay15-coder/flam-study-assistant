import { ValidationResult, FlashcardItem } from '../types/flashcard';

const MIN_CARD_COUNT = 20;

export function validateResult(rawInput: unknown): ValidationResult {
  if (rawInput === null || rawInput === undefined) {
    return {
      isValid: false,
      cards: null,
      error: 'Empty response: The server did not return any data.',
    };
  }

  let data: unknown = rawInput;
  if (typeof rawInput === 'string') {
    try {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        return {
          isValid: false,
          cards: null,
          error: 'Empty string: Received blank text instead of structured data.',
        };
      }
      data = JSON.parse(trimmed);
    } catch (parseError) {
      return {
        isValid: false,
        cards: null,
        error: `Malformed JSON: The output could not be parsed as valid JSON. (${(parseError as Error).message})`,
      };
    }
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      isValid: false,
      cards: null,
      error: 'Invalid JSON shape: Root element must be an object containing a "cards" property.',
    };
  }

  const record = data as Record<string, unknown>;

  if (!('cards' in record)) {
    return {
      isValid: false,
      cards: null,
      error: 'Missing property: Expected root object to contain a "cards" field.',
    };
  }

  if (!Array.isArray(record.cards)) {
    return {
      isValid: false,
      cards: null,
      error: 'Invalid type: The "cards" property must be a list/array.',
    };
  }

  if (record.cards.length < MIN_CARD_COUNT) {
    return {
      isValid: false,
      cards: null,
      error: `Insufficient cards: The AI returned ${record.cards.length} flashcards, but at least ${MIN_CARD_COUNT} are required.`,
    };
  }

  const validatedCards: FlashcardItem[] = [];
  const seenQuestions = new Set<string>();

  for (let index = 0; index < record.cards.length; index++) {
    const item = record.cards[index];

    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return {
        isValid: false,
        cards: null,
        error: `Invalid card at index ${index}: Item is not an object.`,
      };
    }

    const cardObj = item as Record<string, unknown>;

    if (!('question' in cardObj)) {
      return {
        isValid: false,
        cards: null,
        error: `Missing question at card ${index + 1}: Each card must have a "question" field.`,
      };
    }

    if (typeof cardObj.question !== 'string') {
      return {
        isValid: false,
        cards: null,
        error: `Invalid question type at card ${index + 1}: "question" must be a string.`,
      };
    }

    const trimmedQuestion = cardObj.question.trim();
    if (trimmedQuestion.length === 0) {
      return {
        isValid: false,
        cards: null,
        error: `Empty question at card ${index + 1}: "question" string cannot be blank.`,
      };
    }

    const normalizedQuestion = trimmedQuestion.toLowerCase().replace(/\s+/g, ' ');
    if (seenQuestions.has(normalizedQuestion)) {
      return {
        isValid: false,
        cards: null,
        error: `Duplicate question at card ${index + 1}: Each flashcard must test a distinct concept.`,
      };
    }
    seenQuestions.add(normalizedQuestion);

    if (!('answer' in cardObj)) {
      return {
        isValid: false,
        cards: null,
        error: `Missing answer at card ${index + 1}: Each card must have an "answer" field.`,
      };
    }

    if (typeof cardObj.answer !== 'string') {
      return {
        isValid: false,
        cards: null,
        error: `Invalid answer type at card ${index + 1}: "answer" must be a string.`,
      };
    }

    const trimmedAnswer = cardObj.answer.trim();
    if (trimmedAnswer.length === 0) {
      return {
        isValid: false,
        cards: null,
        error: `Empty answer at card ${index + 1}: "answer" string cannot be blank.`,
      };
    }

    validatedCards.push({
      id: `card-${index + 1}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      question: trimmedQuestion,
      answer: trimmedAnswer,
    });
  }

  return {
    isValid: true,
    cards: validatedCards,
    error: null,
  };
}
