'use client'

import { useStoreModal } from '@/hooks/use-store-modal'
import { useEffect } from 'react'

const SetupPage = () => {
  const isOpen = useStoreModal((state) => state.isOpen)
  const opOpen = useStoreModal((state) => state.onOpen)

  useEffect(() => {
    if (!isOpen) {
      opOpen()
    }
  }, [opOpen, isOpen])

  return (
    <div>
      Root page
    </div>
  )
}

export default SetupPage
