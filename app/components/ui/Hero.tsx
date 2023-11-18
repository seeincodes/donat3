import NextLink from 'next/link'
import Image from 'next/image'
import { Center } from '@chakra-ui/react'

export default function Hero() {
  return (
    <Center p={12}>
      <NextLink href="/">
        <Image
          priority
          src="/donat3-logo.png"
          alt="inverter_logo"
          width={82}
          height={82}
        />
      </NextLink>
    </Center>
  )
}
