import { createSafe } from '@/lib/utils/SafeApiKit'
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react'
import { useState } from 'react'

export default function CreateSafe() {
  const [ownerAddress, setOwnerAddress] = useState('')

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    createSafe(ownerAddress)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="owner-address" isRequired>
        <FormLabel>Owner Address</FormLabel>
        <Input
          type="text"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
        />
      </FormControl>
      <Button mt={4} colorScheme="teal" type="submit">
        Create Safe
      </Button>
    </form>
  )
}
