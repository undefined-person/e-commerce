import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '@/lib/prismadb'

export async function GET(req: Request, { params } : {params: {colorId: string}}) {
  try {
    if (!params.colorId) {
      return new NextResponse('Missing colorId', { status: 400 })
    }

    const color = await prismaDb.color.findUnique({
      where: {
        id: params.colorId,
      },
    })

    return NextResponse.json(color)
  } catch (err) {
    console.error('[COLOR_GET]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params } : {params: {storeId: string, colorId: string}},
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { name, value } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Missing name', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Missing value', { status: 400 })
    }

    if (!params.colorId) {
      return new NextResponse('Missing colorId', { status: 400 })
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

    const color = await prismaDb.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(color)
  } catch (err) {
    console.error('[COLOR_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params } :
  {params: {storeId: string, colorId: string}}) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.colorId) {
      return new NextResponse('Missing colorId', { status: 400 })
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

    const color = await prismaDb.color.delete({
      where: {
        id: params.colorId,
      },
    })

    return NextResponse.json(color)
  } catch (err) {
    console.error('[COLOR_DELETE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
