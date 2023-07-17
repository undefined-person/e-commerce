import { ReactNode } from 'react'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import prismaDb from '@/lib/prismadb'

import { Navbar } from '@/components/navbar'

interface DashboardLayoutProps {
  children: ReactNode
  params: {
    storeId: string;
  }
}

export default async function DashboardLayout(props : DashboardLayoutProps) {
  const { children, params } = props
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismaDb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
