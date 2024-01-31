import { Assets } from '@/types/search-assets';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ids = '' } = await req.json();

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
          method: 'getAssetBatch',
          params: {
            ids,
            options: {
              showFungible: true,
            },
          },
        }),
      }
    );

    const { result } = (await response.json()) as Assets;

    return NextResponse.json({ result });
  } catch (err) {
    console.log(err);
  }
}
