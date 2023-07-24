import { format } from 'date-fns'

import { currencyFormatter } from '@/lib/utils'
import prismaDb from '@/lib/prismadb'
import { OrderClient } from './components/client'
import { OrderColumn } from './components/columns'

interface OrdersPageProps {
  params: {
    storeId: string
  }
}

const OrdersPage = async (props: OrdersPageProps) => {
  const { params } = props

  const orders = await prismaDb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid,
    products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: currencyFormatter.format(order.orderItems
      .reduce((acc, orderItem) => acc + Number(orderItem.product.price), 0)),
    createdAt: format(order.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage
