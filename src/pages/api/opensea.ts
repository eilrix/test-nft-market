import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import queryString from 'query-string';

const OPENSEA_API_URL = process.env.NEXT_PUBLIC_OPENSEA_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await (await fetch(`${OPENSEA_API_URL}/assets?${queryString
        .stringify(req.query, { encode: false })}`)).json();
    res.status(200).json(data)
}