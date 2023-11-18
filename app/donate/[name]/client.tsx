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
import Login from '@/components/ui/Login'
import { useAccount } from 'wagmi'

export default function Client({ data }: { data: DonateByNameData }) {
  const { isConnected } = useAccount()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <Stack>
        <OrgPreview {...data} />
        <Card mt={3}>
          <CardHeader>Donate with Crypto</CardHeader>
          <CardBody>
            <Stack spacing={3}>
              <SupportedChains />
              {isConnected ? (
                <Button type={'submit'}>Send</Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      // copy address to clipboard
                      navigator.clipboard.writeText(data.address)
                    }}
                  >
                    Copy Address
                  </Button>
                  <Heading mx={'auto'} fontSize={'large'}>
                    OR
                  </Heading>
                  <Login />
                </>
              )}
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </form>
  )
}
