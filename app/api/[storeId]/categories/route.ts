import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '@/lib/prismadb'

export async function POST(req: Request, { params } : {params: {storeId: string}}) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, billboardId } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Missing name', { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse('Missing billboardId', { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const category = await prismaDb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    })

    return NextResponse.json(category)
  } catch (err) {
    console.error('[CATEGORIES_POST]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: Request, { params } : {params: {storeId: string}}) {
  try {
    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const categories = await prismaDb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return NextResponse.json(categories)
  } catch (err) {
    console.error('[CATEGORIES_GET]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
