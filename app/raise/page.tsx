'use client'

import { Hero } from '@/components'
import Login from '@/components/ui/Login'
import {
  batchDeploySafeWithPaymaster,
  getSafeWalletAddress,
} from '@/lib/utils/safe'
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccount, useQuery } from 'wagmi'

export default function Raise() {
  const router = useRouter()
  const { address, isDisconnected } = useAccount()
  const [isDeploying, setIsDeploying] = useState(false)
  const [name, setName] = useState<string>('')

  const safeAddress = useQuery(
    ['safeAddress', address],
    () => {
      return getSafeWalletAddress(address)
    },
    {
      refetchInterval: 10_000,
    }
  )

  useEffect(() => {
    if (!isDisconnected && !isDeploying && !safeAddress) {
      setIsDeploying(true)
      batchDeploySafeWithPaymaster(address).finally(() => {
        setIsDeploying(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected, safeAddress, address])

  return (
    <>
      <div className="header">
        <Hero />
      </div>
      <Card variant={'info'}>
        <CardHeader>Start Raising Money in Crypto TODAY!</CardHeader>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              router.push(`/donate/${name}`)
            }}
          >
            <Stack>
              {isDisconnected ? (
                <Login />
              ) : (
                <Stack align={'center'} spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>Donat3 Name</FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <InputRightAddon>.donat3.eth</InputRightAddon>
                    </InputGroup>
                  </FormControl>
                  <Button type="submit">Donat3</Button>
                </Stack>
              )}
            </Stack>
          </form>
        </CardBody>
      </Card>
    </>
  )
}
