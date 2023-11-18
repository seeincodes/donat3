import { DonateByNameData } from '@/donate/[name]/page'
import { Divider, Heading, IconButton, Stack, Tag } from '@chakra-ui/react'
import { AiFillCopy } from 'react-icons/ai'

export default function OrgPreview({
  name,
  amountUSD,
  address,
}: DonateByNameData) {
  const prettyAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(amountUSD))

  return (
    <Stack spacing={4} align={'center'}>
      <Heading>{name}.donat3.eth</Heading>
      <Divider />
      <Heading>Total Raised</Heading>
      <Heading>{prettyAmount}</Heading>
      <Tag p={2} gap={2}>
        Crypto Address: {address}{' '}
        <IconButton
          aria-label="copy_address"
          icon={<AiFillCopy />}
          onClick={() => {
            // copy address to clipboard
            navigator.clipboard.writeText(address)
          }}
        />
      </Tag>
    </Stack>
  )
}
