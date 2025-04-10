'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";


export const getOrderById = async( orderId: string ) => {

  const session = await auth()

  // Check if the user is authenticated
  if ( !session ) {
    return {
      ok: false,
      message: 'Session not found'
    }
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,
                
                ProductImage: {
                  take: 1,
                  select: {
                    url: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Check if the order exists
    if ( !order ) throw `${ orderId } not found`

    // Check if the order belongs to the user or is the admin
    if ( session.user.role === 'user' ) {
      if ( order.userId !== session.user.id ) throw `${ orderId } is not yours`
    }

    return {
      ok: true,
      message: 'Order found',
      order
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error fetching order'
    }
  }
}