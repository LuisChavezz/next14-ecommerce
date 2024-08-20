'use server'

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";


export const getProductBySlug = async ( slug: string ) => {

  try {
    const product = await prisma.product.findUnique({
      include: {
        ProductImage: {
          select: {
            url: true
          }
        }
      },
      where: {
        slug
      }
    });

    if ( !product ) return null;

    return {
      ...product,
      images: product.ProductImage.map((image) => image.url)
    }

  } catch (error) {
    console.error(error)
    notFound();
    // throw new Error("Error fetching product by slug");
  }
}