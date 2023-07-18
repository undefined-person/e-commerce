import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

import prismaDb from '@/lib/prismadb'

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = body

    if (!name) {
      return new NextResponse('Missing name', { status: 400 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const store = await prismaDb.store.update({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    })

    return NextResponse.json(store)
  } catch (err) {
    console.error('[STORE_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { storeId } = params

    if (!storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const store = await prismaDb.store.delete({
      where: {
        id: storeId,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (err) {
    console.error('[STORE_DELETE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
