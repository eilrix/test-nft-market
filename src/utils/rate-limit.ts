import LRU from 'lru-cache';
import { NextApiResponse } from 'next';

export const rateLimit = (options: {
    interval: string | number;
    uniqueTokenPerInterval: string | number;
}) => {
    const tokenCache = new LRU({
        max: parseInt((options.uniqueTokenPerInterval || 500) as string, 10),
        maxAge: parseInt((options.interval || 60000) as string, 10),
    })

    return {
        check: (res: NextApiResponse, limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount: any = tokenCache.get(token) || [0]
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount)
                }
                tokenCount[0] += 1

                const currentUsage = tokenCount[0]
                const isRateLimited = currentUsage >= parseInt(limit + '', 10)
                res.setHeader('X-RateLimit-Limit', limit)
                res.setHeader(
                    'X-RateLimit-Remaining',
                    isRateLimited ? 0 : limit - currentUsage
                )

                return isRateLimited ? reject() : resolve();
            }),
    }
}

export default rateLimit