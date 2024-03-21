export function buildFetchRateLimitQuery(): string {
  return `
query {
  rateLimit {
    limit
    remaining
  }
}`
}
