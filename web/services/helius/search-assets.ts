import { AssetParams, Assets } from '@/types/search-assets';

export const searchAssets = async (params: AssetParams, apiKey: string) => {
  const response = await fetch(
    `https://mainnet.helius-rpc.com?api-key=${apiKey}`,
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

  return result;
};
