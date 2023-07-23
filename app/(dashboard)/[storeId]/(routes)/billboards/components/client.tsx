'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'
import { BillboardColumn, columns } from './columns'

interface BillboardClientProps {
  data: Array<BillboardColumn>
}

export const BillboardClient = (props: BillboardClientProps) => {
  const { data } = props
  const router = useRouter()
  const params = useParams()

  const handleAddNew = () => {
    router.push(`/${params.storeId}/billboards/new`)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage your store's billboards."
        />
        <Button onClick={handleAddNew}>
          <PlusIcon className="mr-2 h4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="Api" description="API calls for Billboards" />
      <Separator />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  )
}
