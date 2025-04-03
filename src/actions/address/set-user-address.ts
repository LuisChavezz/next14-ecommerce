'use server'

import { Address } from "@/interfaces"
import prisma from "@/lib/prisma"


export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId)

    return {
      ok: true,
      message: 'Address set successfully',
      address: newAddress
    }

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error setting user address',
    }
  }
}

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    // Check if user already has an address
    const storeAddress = await prisma.userAddress.findUnique({
      where: { userId }
    })

    const addressToSave = {
      userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      city: address.city,
    }

    // If user doesn't have an address, create it
    if (!storeAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave
      })

      return newAddress
    }

    // If user has an address, update it
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave
    })

    return updatedAddress

  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error creating or replacing address',
    }
  }
}
