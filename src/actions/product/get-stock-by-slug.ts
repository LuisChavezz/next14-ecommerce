'use server'

import prisma from "@/lib/prisma";


export const getStockBySlug = async ( slug: string ): Promise<number> => {

  try {
    const stock = await prisma.product.findUnique({
      where: {
        slug
      },
      select: {
        inStock: true
      }
    });

    return stock?.inStock || 0;

  } catch (error) {
    console.error(error)
    throw new Error("Error fetching product by slug");
  }
}