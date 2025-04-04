'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";


interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async( productIds: ProductToOrder[], address: Address ) => {

  // Validate if user is authenticated
  const session = await auth()
  const userId = session?.user.id
  if ( !userId ) {
    return {
      ok: false,
      message: 'User session not found'
    }
  }

  // Get the product information
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map( product => product.productId )
      }
    },
  })

  // Calculate the quantity of products
  const itemsInOrder = productIds.reduce(( count, product ) => count + product.quantity, 0)

  // Calculate the subtotal, total and taxes

}