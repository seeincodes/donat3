'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
} from '@chakra-ui/react'
import type { DonateByNameData } from './page'
import OrgPreview from '@/components/OrgPreview'
import SupportedChains from '@/components/ui/SupportedChains'

export default function Client({ data }: { data: DonateByNameData }) {
  return (
    <Stack>
      <OrgPreview {...data} />
      <Card>
        <CardHeader>Donate with Crypto</CardHeader>
        <CardBody>
          <Stack>
            <SupportedChains />
            <Button>Copy Address</Button>
            <Heading>OR</Heading>
            <Button>Connect Wallet</Button>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}
