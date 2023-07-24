import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '@/lib/prismadb'

export async function GET(req: Request, { params } : {params: {categoryId: string}}) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Missing billboardId', { status: 400 })
    }

    const category = await prismaDb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (err) {
    console.error('[CATEGORY_GET]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params } : {params: {storeId: string, categoryId: string}},
) {
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

    if (!params.categoryId) {
      return new NextResponse('Missing categoryId', { status: 400 })
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

    const category = await prismaDb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    })

    return NextResponse.json(category)
  } catch (err) {
    console.error('[CATEGORY_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params } :
  {params: {storeId: string, categoryId: string}}) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.categoryId) {
      return new NextResponse('Missing categoryId', { status: 400 })
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

    const category = await prismaDb.category.delete({
      where: {
        id: params.categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (err) {
    console.error('[CATEGORY_DELETE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
