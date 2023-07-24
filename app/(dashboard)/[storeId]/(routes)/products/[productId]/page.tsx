import prismaDb from '@/lib/prismadb'
import { ProductForm } from './components/product-form'

interface ProductPageProps {
  params: {
    productId: string
    storeId: string
  }
}

const ProductPage = async (props: ProductPageProps) => {
  const { params } = props

  const product = await prismaDb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  })

  const categories = await prismaDb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const colors = await prismaDb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const sizes = await prismaDb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  )
}

export default ProductPage
