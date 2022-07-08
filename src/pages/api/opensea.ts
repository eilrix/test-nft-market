import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import queryString from 'query-string';
import { rateLimit } from '../../utils/rate-limit';

const OPENSEA_API_URL = process.env.NEXT_PUBLIC_OPENSEA_API_URL;

const limiter = rateLimit({
    interval: 10 * 1000, // 10 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await limiter.check(res, 5, 'CACHE_TOKEN') // 5 requests per 10 sec
    } catch {
        res.status(429).json({ error: 'Rate limit exceeded' })
    }

    try {
        const seaRes = await fetch(`${OPENSEA_API_URL}/assets?${queryString
            .stringify(req.query, { encode: false })}`);

        const data = await seaRes.json();

        if (seaRes.status >= 400) {
            throw new Error(`Request failed: ${JSON.stringify(data || '')}`);
        }
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }

}