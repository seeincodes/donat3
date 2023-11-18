'use client'

import { Hero } from '@/components'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Donate() {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  return (
    <>
      <div className="header">
        <Hero />
      </div>
      <Card variant={'info'} mt={3}>
        <CardHeader>Donate with Crypto</CardHeader>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              router.push(`/donate/${name}`)
            }}
          >
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
          </form>
        </CardBody>
      </Card>
    </>
  )
}
