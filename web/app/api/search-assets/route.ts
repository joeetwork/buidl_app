import { Assets } from '@/types/search-assets';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      ownerAddress = '',
      compressed = false,
      grouping,
      page = 1,
      limit = 1000,
    } = await req.json();

    const response = await fetch(
      `https://devnet.helius-rpc.com?api-key=${process.env.HELIUS_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'my-id',
          method: 'searchAssets',
          params: {
            ownerAddress,
            grouping,
            compressed,
            page,
            limit,
          },
        }),
      }
    );

    const { result } = (await response.json()) as Assets;

    if (result) {
      return NextResponse.json({ result });
    }
    return;
  } catch (err) {
    console.log(err);
  }
}
