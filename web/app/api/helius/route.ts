import { searchAssets } from '@/services/helius/search-assets';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ownerAddress } = await req.json();
    const compressed = false;
    const page = 1;
    const limit = 1000;

    const data = await searchAssets(
      {
        ownerAddress,
        compressed,
        page,
        limit,
      },
      process.env.HELIUS_KEY
    );

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
