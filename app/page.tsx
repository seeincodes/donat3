'use client'

import { Card, CardHeader, CardBody, Button, Stack } from '@chakra-ui/react'
import { Hero } from './components'
import { Link } from '@chakra-ui/next-js'

export default function HomePage() {
  return (
    <>
      <div className="header">
        <Hero />
      </div>
      <Card variant={'info'}>
        <CardHeader>Welcome! What would you like to do?</CardHeader>
        <CardBody>
          <Stack justify={'center'} align={'center'} spacing={6}>
            <Button as={Link} href="/donate">
              Donate
            </Button>
            <Button as={Link} href="/raise">
              Raise Crypto
            </Button>
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}
