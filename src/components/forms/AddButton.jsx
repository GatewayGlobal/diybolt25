import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

export default function AddButton({ onClick, label }) {
  return (
    <Button 
      onClick={onClick}
      leftSection={<IconPlus size={16} />}
      variant="filled"
      color="blue"
    >
      Add {label}
    </Button>
  )
}
