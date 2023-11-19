export async function swap({
  chainId,
  src,
  dst,
  amount,
  from,
  receiver,
}: {
  chainId: number
  src: `0x${string}`
  dst: `0x${string}`
  amount: string
  from: `0x${string}`
  receiver: `0x${string}`
}) {
  const url = ''

  const queryParams = new URLSearchParams({
    src,
    dst,
    amount,
    from,
    receiver,
    slippage: '1',
  }).toString()
  const urlWithParams = `https://api.1inch.dev/swap/v5.2/${chainId}/swap?${queryParams}`

  try {
    const response = await fetch(urlWithParams, {
      headers: {
        Authorization: 'Bearer sLBvWdpiJMeuBFF7OtwxUuOGUWn8B1tg',
      },
    })
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}
