import { ReactNode } from 'react'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import prismaDb from '@/lib/prismadb'

interface LayoutProps {
  children: ReactNode
}

export default async function setLayout(props: LayoutProps) {
  const { children } = props
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismaDb.store.findFirst({
    where: {
      userId,
    },
  })

  if (store) {
    redirect(`/${store.id}`)
  }

  return children
}
