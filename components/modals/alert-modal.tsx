'use client'

import { useIsMounted } from '@/hooks/use-mounted'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

export const AlertModal = (props: AlertModalProps) => {
  const {
    isLoading,
    isOpen,
    onClose,
    onConfirm,
  } = props

  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      title="Are you sure you want to delete this store?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="destructive"
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
