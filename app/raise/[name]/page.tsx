import Client from './client'
import { FourOFour } from '@/components/ui'

async function fetchData(name: string) {
  const data = {
    name,
    amountUSD: '100',
    address: '0x7c1d8FB8f86faC59d1DE10C9bE00f816d4125c46' as `0x${string}`,
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
