'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";


interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

  // Validate if user is authenticated
  const session = await auth()
  const userId = session?.user.id
  if (!userId) {
    return {
      ok: false,
      message: 'User session not found'
    }
  }

  // Get the product information
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map(product => product.productId)
      }
    },
  })

  // Calculate the quantity of products
  const itemsInOrder = productIds.reduce((count, product) => count + product.quantity, 0)

  // Calculate the subtotal, total and taxes
  const { subTotal, tax, total } = productIds.reduce((totals, item) => {

    // Get the product information
    const productQuantity = item.quantity
    const product = products.find(product => product.id === item.productId)

    // Check if the product exists
    if (!product) throw new Error(`${item.productId} not found - 500`)

    // Calculate
    const subTotal = product.price * productQuantity
    totals.subTotal += subTotal
    totals.tax += subTotal * 0.15
    totals.total += subTotal * 1.15

    return totals

  }, { subTotal: 0, tax: 0, total: 0 })

  // Create the transaction
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {

      // 1. Update the stock of the products
      const updatedProductsPromises = products.map(async (product) => {

        // Accumulate the quantity of the product
        const productQuantity = productIds.filter(
          p => p.productId === product.id
        ).reduce((acc, item) => item.quantity + acc, 0)

        if (productQuantity === 0) {
          throw new Error(`${product.id} dont have stock`)
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity
            }
          }
        })
      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      // Check negative stock values
      updatedProducts.forEach(product => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} dont have stock`)
        }
      })

      // 2. Create the order - Headers - Details
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productIds.map(productI => ({
                productId: productI.productId,
                quantity: productI.quantity,
                size: productI.size,
                price: products.find(product => product.id === productI.productId)?.price || 0
              }))
            }
          }
        }
      })

      // 3. Create the order address
      const { country, ...restAddress } = address

      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          countryId: country,
          ...restAddress
        }
      })

      return {
        order,
        updatedProducts: updatedProducts,
        orderAddress: orderAddress
      }

    })

    return {
      ok: true,
      message: 'Order placed successfully',
      order: prismaTx.order,
      prismaTx
    }


  } catch (error: any) {
    return {
      ok: false,
      message: error?.message
    }
  }
}