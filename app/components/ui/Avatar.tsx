import { Box } from '@chakra-ui/react'
import { AvatarComponent } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export const Avatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <Image
      alt={address}
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <Box
      width={size}
      height={size}
      background={'dark.accent.300'}
      borderRadius={'full'}
    />
  )
}
