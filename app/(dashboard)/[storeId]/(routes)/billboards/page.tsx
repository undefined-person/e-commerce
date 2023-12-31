import prismaDb from '@/lib/prismadb'
import { format } from 'date-fns'

import { BillboardClient } from './components/client'
import { BillboardColumn } from './components/columns'

interface BillboardsPageProps {
  params: {
    storeId: string
  }
}

const BillboardsPage = async (props: BillboardsPageProps) => {
  const { params } = props

  const billboards = await prismaDb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage
