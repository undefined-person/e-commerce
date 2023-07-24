import { format } from 'date-fns'

import { currencyFormatter } from '@/lib/utils'
import prismaDb from '@/lib/prismadb'
import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'

interface ProductsPageProps {
  params: {
    storeId: string
  }
}

const ProductsPage = async (props: ProductsPageProps) => {
  const { params } = props

  const products = await prismaDb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: currencyFormatter.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color,
    createdAt: format(product.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage
