'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import { OrderColumn, columns } from './columns'

interface OrderClientProps {
  data: Array<OrderColumn>
}

export const OrderClient = (props: OrderClientProps) => {
  const { data } = props

  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage your store's orders."
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  )
}
