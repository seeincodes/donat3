import Client from './client'
import { FourOFour } from '@/components/ui'

async function fetchData(name: string) {
  const data = {
    name,
    amountUSD: '100',
    address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
  }
  return { isSuccess: true, data }
}

export type DonateByNameData = Awaited<ReturnType<typeof fetchData>>['data']

export default async function DonateByName({
  params,
}: {
  params: { name: string }
}) {
  const { isSuccess, data } = await fetchData(params.name)

  if (!isSuccess) return <FourOFour />

  return <Client data={data} />
}
