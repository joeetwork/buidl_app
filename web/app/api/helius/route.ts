import { Assets } from '@/types/search-assets';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      ownerAddress = '',
      compressed = false,
      page = 1,
      limit = 1000,
    } = await req.json();

    const params = { ownerAddress, compressed, page, limit };

    const response = await fetch(
      `https://mainnet.helius-rpc.com?api-key=${'bb5648b7-6cf8-4ff7-b3ab-932ce363f52c'}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'my-id',
          method: 'searchAssets',
          params,
        }),
      }
    );

    const { result } = (await response.json()) as Assets;

    return NextResponse.json({ result });
  } catch (err) {
    console.log(err);
  }
}
