export default function handler(_req: any, res: any): void {
	res.status(200).json({
		status: 'ok',
		hasApiKey: Boolean(process.env.GEMINI_API_KEY),
		timestamp: new Date().toISOString(),
	});
}