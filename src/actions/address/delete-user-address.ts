'use server'

import prisma from "@/lib/prisma"


export const deleteUserAddress = async (userId: string) => {
  try {
    // If user has an address, delete it
    await prisma.userAddress.delete({
      where: { userId }
    })

    return {
      ok: true,
      message: 'Address deleted successfully',
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error deleting user address',
    }
  }
}