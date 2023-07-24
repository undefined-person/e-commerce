import prismaDb from '@/lib/prismadb'
import { SizeForm } from './components/billboard-form'

interface SizePageProps {
  params: {
    sizeId: string
  }
}

const SizePage = async (props: SizePageProps) => {
  const { params } = props

  const sizes = await prismaDb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizes} />
      </div>
    </div>
  )
}

export default SizePage
