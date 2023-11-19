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
  Spinner,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccount, useQuery, useSignMessage } from 'wagmi'
import { WorkerRequest, postToCloudflare } from './actions'

export default function Raise() {
  const router = useRouter()
  const { address } = useAccount()
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

  const isLoading =
    isDeploying || safeAddress.isFetching || safeAddress.isLoading

  const { data, isLoading: loading, signMessage, variables } = useSignMessage()

  const requestBody: WorkerRequest = {
    name: `${name}.donat3.eth`,
    owner: address!,
    addresses: { '60': address },
    texts: { name },
    signature: {
      hash: data!,
      message: variables?.message!,
    },
  }

  useEffect(() => {
    if (!isLoading && !address && !safeAddress) {
      setIsDeploying(true)
      batchDeploySafeWithPaymaster(address).finally(() => {
        setIsDeploying(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress, address])

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
              postToCloudflare(requestBody)
              // router.push(`/donate/${name}`)
            }}
          >
            <Stack>
              {isLoading ? (
                <Spinner m={'auto'} />
              ) : !address ? (
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
                  <Button type="submit">Register</Button>
                </Stack>
              )}
            </Stack>
          </form>
        </CardBody>
      </Card>
    </>
  )
}
