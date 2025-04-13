'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"


export const setTransactionId = async (orderId: string, transactionId: string) => {

  const session = await auth()

  // Check if the user is authenticated
  if ( !session ) {
    return {
      ok: false,
      message: 'Session not found'
    }
  }

  try {
    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        transactionId
      }
    })

    // Check if the order exists
    if ( !order ) throw `${ transactionId } not found`

    return {
      ok: true,
      message: 'TransactionId saved'
    }
    
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error saving transactionId'
    }
  }
}
