
export interface ApiErrorResponse {
  error: string;
  details?: string;
}

const REQUEST_TIMEOUT_MS = 30000;

export async function generateFlashcards(
  input: string,
  signal?: AbortSignal,
  simulation?: string
): Promise<unknown> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Please provide a study topic or notes before generating flashcards.');
  }

  const url = simulation ? `/api/generate?simulate=${encodeURIComponent(simulation)}` : '/api/generate';

  const requestController = new AbortController();
  const timeoutId = setTimeout(() => requestController.abort(), REQUEST_TIMEOUT_MS);

  if (signal) {
    const abortListener = () => requestController.abort();
    signal.addEventListener('abort', abortListener, { once: true });

    try {
      return await makeRequest(url, trimmed, requestController.signal, signal, abortListener);
    } finally {
      clearTimeout(timeoutId);
      signal.removeEventListener('abort', abortListener);
    }
  }

  try {
    return await makeRequest(url, trimmed, requestController.signal);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function makeRequest(
  url: string,
  trimmed: string,
  requestSignal: AbortSignal,
  parentSignal?: AbortSignal,
  abortListener?: () => void
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: trimmed }),
      signal: requestSignal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (parentSignal?.aborted) {
        throw new Error('Request was cancelled.');
      }
      throw new Error('Request timed out after 30 seconds. Please try again.');
    }
    throw new Error(
      'Network connection failed. Please check your internet connection or verify the backend server is running.'
    );
  } finally {
    if (abortListener && parentSignal) {
      parentSignal.removeEventListener('abort', abortListener);
    }
  }

  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    throw new Error(`Server returned a non-JSON response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const errorObj = responseData as { error?: string; details?: string };
    const message = errorObj?.error || errorObj?.details || `Server responded with error status ${response.status}`;
    throw new Error(message);
  }

  return responseData;
}
