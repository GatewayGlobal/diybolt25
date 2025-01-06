import { Group, ActionIcon, Tooltip } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'

export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <Group gap="xs">
      <Tooltip label="Edit">
        <ActionIcon variant="subtle" color="blue" onClick={onEdit}>
          <IconEdit size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Delete">
        <ActionIcon variant="subtle" color="red" onClick={onDelete}>
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}
