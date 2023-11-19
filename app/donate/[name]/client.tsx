'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import type { DonateByNameData } from './page'
import OrgPreview from '@/components/OrgPreview'
import SupportedChains from '@/components/ui/SupportedChains'
import Login from '@/components/ui/Login'
import { useAccount } from 'wagmi'

export default function Client({ data }: { data: DonateByNameData }) {
  const modelDisclosure = useDisclosure()
  const { isConnected } = useAccount()

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          modelDisclosure.onOpen()
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
                  <Button type={'submit'}>Donat3</Button>
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
      <Modal isOpen={modelDisclosure.isOpen} onClose={modelDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Select your crypto Donat3
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Stack>
              <Button>USDC</Button>
              <Button>...Coming Soon</Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
