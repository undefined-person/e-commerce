'use client'

import { StoreModal } from '@/components/modals/store-modal'
import { useIsMounted } from '@/hooks/use-mounted'

export const ModalProvider = () => {
  const isMounted = useIsMounted()

  if (!isMounted) {
    return null
  }

  return (
    <StoreModal />
  )
}
