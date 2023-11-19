'use client'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
import { useState } from 'react'
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5'

export default function Client({ data }: { data: DonateByNameData }) {
  const [dst, setDst] = useState<string>('')
  const modelDisclosure = useDisclosure()
  const successDisclosure = useDisclosure()
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
            <CardHeader>Withdraw Donations</CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <SupportedChains />
                {!isConnected ? (
                  <Login />
                ) : (
                  <>
                    <Button onClick={modelDisclosure.onOpen}>
                      Withdraw to Coinbase
                    </Button>
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
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Stack align={'center'} spacing={6}>
              <FormControl isRequired>
                <FormLabel>USDC ERC20 Address</FormLabel>
                <Input
                  placeholder="..."
                  value={dst}
                  onChange={(e) => setDst(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              w={'full'}
              onClick={() => {
                modelDisclosure.onClose()
                successDisclosure.onOpen()
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={successDisclosure.isOpen}
        onClose={successDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Stack align={'center'} spacing={6}>
              <IoCheckmarkDoneCircleOutline
                style={{ height: '128px', width: '128px' }}
              />
              <Heading>Success!</Heading>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button w={'full'} onClick={successDisclosure.onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
