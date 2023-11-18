'use client'

import Image from 'next/image'
import { Stack, Flex, Text } from '@chakra-ui/react'

export default function SupportedChains() {
  const imgUrls = ['ethereum', 'bsc', 'base', 'polygon', 'optimism', 'arbitrum']
  return (
    <Stack mb={2}>
      <Text>Supported Chains</Text>
      <Flex>
        {imgUrls.map((i) => (
          <Image
            key={i}
            src={`/chains/${i}.png`}
            alt={`${i}_logo`}
            width={32}
            height={32}
          />
        ))}
      </Flex>
    </Stack>
  )
}
