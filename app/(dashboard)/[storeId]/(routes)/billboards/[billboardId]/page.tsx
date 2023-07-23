import prismaDb from '@/lib/prismadb'
import { BillboardForm } from './components/billboard-form'

interface BillboardPageProps {
  params: {
    billboardId: string
  }
}

const BillboardPage = async (props: BillboardPageProps) => {
  const { params } = props

  const billboards = await prismaDb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboards} />
      </div>
    </div>
  )
}

export default BillboardPage
