type Bucket = { tokens: number; lastRefill: number }

const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, refillMs: number): boolean {
	const now = Date.now()
	const bucket = buckets.get(key) || { tokens: limit, lastRefill: now }
	// Refill tokens linearly
	const elapsed = now - bucket.lastRefill
	if (elapsed > refillMs) {
		const refillCount = Math.floor(elapsed / refillMs)
		bucket.tokens = Math.min(limit, bucket.tokens + refillCount)
		bucket.lastRefill = bucket.lastRefill + refillCount * refillMs
	}
	if (bucket.tokens <= 0) {
		buckets.set(key, bucket)
		return false
	}
	bucket.tokens -= 1
	buckets.set(key, bucket)
	return true
}

export function getIp(request: Request): string {
	// next headers may have x-forwarded-for
	const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim()
	return ip || 'unknown'
} 