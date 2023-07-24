import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

import prismaDb from '@/lib/prismadb'

export async function GET(req: Request, { params } : {params: {productId: string}}) {
  try {
    if (!params.productId) {
      return new NextResponse('Missing productId', { status: 400 })
    }

    const product = await prismaDb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
    })

    return NextResponse.json(product)
  } catch (err) {
    console.error('[PRODUCT_GET]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params } : {params: {storeId: string, productId: string}},
) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived,
    } = body

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Missing label', { status: 400 })
    }

    if (!price) {
      return new NextResponse('Missing price', { status: 400 })
    }

    if (!categoryId) {
      return new NextResponse('Missing categoryId', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Missing sizeId', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Missing colorId', { status: 400 })
    }

    if (!images || !images.length) {
      return new NextResponse('Missing images', { status: 400 })
    }

    if (!params.productId) {
      return new NextResponse('Missing productId', { status: 400 })
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

    const product = await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        images: {
          deleteMany: {},
          createMany: {
            data: images.map((image: {url: string}) => image),
          },
        },
        isFeatured,
        isArchived,
      },
    })

    return NextResponse.json(product)
  } catch (err) {
    console.error('[PRODUCT_PATCH]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params } :
  {params: {storeId: string, productId: string}}) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 })
    }

    if (!params.productId) {
      return new NextResponse('Missing productId', { status: 400 })
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

    const product = await prismaDb.product.delete({
      where: {
        id: params.productId,
      },
    })

    return NextResponse.json(product)
  } catch (err) {
    console.error('[PRODUCT_DELETE]', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
