'use server'

import prisma from "@/lib/prisma"


export const getUserAddress = async (userId: string) => {
  try {
    // Get user address
    const userAddress = await prisma.userAddress.findUnique({
      where: { userId }
    })

    if ( !userAddress ) {
      return null
    }

    const { countryId, address2, ...restAddress } = userAddress

    return {
      ...restAddress,
      country: countryId,
      address2: address2 || '',
    }
    
  } catch (error) {
    console.log(error)
    return null
    
  }
}