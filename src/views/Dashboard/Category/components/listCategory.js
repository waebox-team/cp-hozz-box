import { Button } from '@chakra-ui/react'
import React from 'react'

function ListCategory() {
  return (
    <div>
      <Stack spacing={4} direction='row' align='center'>
  <Button colorScheme='teal' size='xs'>
    Button
  </Button>
  <Button colorScheme='teal' size='sm'>
    Button
  </Button>
  <Button colorScheme='teal' size='md'>
    Button
  </Button>
  <Button colorScheme='teal' size='lg'>
    Button
  </Button>
</Stack>
    </div>
  )
}

export default ListCategory