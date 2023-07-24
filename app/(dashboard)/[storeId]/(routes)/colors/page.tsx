import { format } from 'date-fns'

import prismaDb from '@/lib/prismadb'
import { ColorClient } from './components/client'
import { ColorColumn } from './components/columns'

interface ColorsPageProps {
  params: {
    storeId: string
  }
}

const ColorsPage = async (props: ColorsPageProps) => {
  const { params } = props

  const colors = await prismaDb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedColors: ColorColumn[] = colors.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}

export default ColorsPage
