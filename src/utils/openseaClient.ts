import queryString from 'query-string';
import { toast } from 'react-toastify';

export type Asset = {
    title?: string;
    author?: string;
    image?: string;
    link?: string;
}

export type Search = {
    search?: string;
    buyNow?: boolean;
    newItem?: boolean;
    priceMin?: number;
    priceMax?: boolean;
}

/**
 * Temporarily fetch from proxy (that fetches data from https://opensea.io/assets frontend)
 */
export async function fetchAssets(options?: Search): Promise<Asset[]> {
    const query = queryString.stringify(
        Object.assign({}, ...Object.entries(options ?? {}).map(([key, value]) => ({ [key]: value || undefined }))),
        { encode: false });

    const res = await fetch(`api/opensea?${query}`);
    if (res.status >= 400) {
        if (res.status === 429) {
            toast.error('Too many requests');
        } else {
            toast.error('OpenSea API error');
        }
        throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
}