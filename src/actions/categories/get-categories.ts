'use server'

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"


export const getCategories = async () => {

  const session = await auth()

  // Check if the user is admin
  if ( session?.user.role !== 'admin' ) {
    return {
      ok: false,
      message: 'You are not authorized to access this resource',
      categories: []
    }
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return {
      ok: true,
      message: 'Categories fetched successfully',
      categories
    }
    
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'Error fetching categories',
      categories: []
    }
    
  }

}