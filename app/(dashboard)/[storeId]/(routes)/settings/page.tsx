import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import prismaDb from '@/lib/prismadb'

import { SettingsForm } from './components/settings-form'

interface SettingsPageProps {
  params: {
    storeId: string
  }
}

const SettingsPage = async (props: SettingsPageProps) => {
  const { params } = props
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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default SettingsPage
