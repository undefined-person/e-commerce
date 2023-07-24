import { format } from 'date-fns'

import prismaDb from '@/lib/prismadb'
import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'

interface CategoriesPageProps {
  params: {
    storeId: string
  }
}

const CategoriesPage = async (props: CategoriesPageProps) => {
  const { params } = props

  const categories = await prismaDb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage
