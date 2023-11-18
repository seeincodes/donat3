'use client'

import { Hero } from '@/components'
import Login from '@/components/ui/Login'
import { Card, CardHeader, CardBody, Stack } from '@chakra-ui/react'
import { useState } from 'react'

export default function Raise() {
  const [email, setEmail] = useState<string>()
  return (
    <>
      <div className="header">
        <Hero />
      </div>
      <Card variant={'info'}>
        <CardHeader>Start Raising Money in Crypto TODAY!</CardHeader>
        <CardBody>
          <Stack>
            <Login />
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}
