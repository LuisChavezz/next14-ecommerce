'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";


export const getPaginatedOrders = async() => {

  const session = await auth()

  // Check if the user is authenticated
  if ( session?.user.role !== 'admin' ) {
    return {
      ok: false,
      message: 'You are not authorized to view this page',
    }
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      OrderAddress: {
        select: {
          firstName: true,
          lastName: true,
        }
      }
    }
  })

  return {
    ok: true,
    message: 'Orders found',
    orders
  }

}