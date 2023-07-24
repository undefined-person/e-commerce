'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'
import { SizeColumn, columns } from './columns'

interface SizeClientProps {
  data: Array<SizeColumn>
}

export const SizeClient = (props: SizeClientProps) => {
  const { data } = props
  const router = useRouter()
  const params = useParams()

  const handleAddNew = () => {
    router.push(`/${params.storeId}/sizes/new`)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage your store's sizes."
        />
        <Button onClick={handleAddNew}>
          <PlusIcon className="mr-2 h4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="Api" description="API calls for Sizes" />
      <Separator />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </>
  )
}
