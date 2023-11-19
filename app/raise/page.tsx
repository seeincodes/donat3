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
import { useState } from 'react'
import { useAccount, useQuery, useSignMessage } from 'wagmi'
import { WorkerRequest, postToCloudflare } from './actions'

export default function Raise() {
  const router = useRouter()
  const { address } = useAccount()
  const [isDeploying, setIsDeploying] = useState(false)
  const [name, setName] = useState<string>('main')

  const safeAddress = useQuery(
    ['safeAddress', address],
    async () => {
      return await getSafeWalletAddress(address)
    },
    {
      refetchInterval: 30_000,
    }
  )

  const hasSafe = !!safeAddress.data && !!safeAddress.data.safes.length

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

  const initSafe = async () => {
    if (!!address && !hasSafe && !isLoading) {
      setIsDeploying(true)
      await batchDeploySafeWithPaymaster(address).finally(() => {
        setIsDeploying(false)
      })

      // TODO
      router.push(`/donate/${name}`)
    }
  }

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
              signMessage({
                message: `Register ${name}.donat3.eth`,
              })
              postToCloudflare(requestBody)
              router.push(`/raise/${name}`)
            }}
          >
            <Stack>
              {isLoading ? (
                <Spinner m={'auto'} />
              ) : !address ? (
                <Login />
              ) : !hasSafe ? (
                <Button onClick={initSafe}>Setup Your Safe</Button>
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
