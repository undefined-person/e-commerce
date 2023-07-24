'use client'

import { PlusIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'
import { CategoryColumn, columns } from './columns'

interface CategoryClientProps {
  data: Array<CategoryColumn>
}

export const CategoryClient = (props: CategoryClientProps) => {
  const { data } = props
  const router = useRouter()
  const params = useParams()

  const handleAddNew = () => {
    router.push(`/${params.storeId}/categories/new`)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage your store's categories."
        />
        <Button onClick={handleAddNew}>
          <PlusIcon className="mr-2 h4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="Api" description="API calls for Categories" />
      <Separator />
      <ApiList entityIdName="categoryId" entityName="categories" />
    </>
  )
}
