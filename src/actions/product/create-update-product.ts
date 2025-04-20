'use server'

import { Gender } from '@prisma/client';
import { z } from 'zod';


const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3, { message: 'Title is required' }).max(255, { message: 'Title is too long' }),
  slug: z.string().min(3, { message: 'Slug is required' }).max(255, { message: 'Slug is too long' }),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0, { message: 'Price is required' })
    .transform((value) => Number(value.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0, { message: 'In stock is required' })
    .transform((value) => Number(value.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((value) => value.split(',').map((size) => size.trim())),
  tags: z.string(),
  gender: z.nativeEnum(Gender)
})


export const createOrUpdateProduct = async ( formData: FormData ) => {
  const data = Object.fromEntries( formData );
  const parsedProduct = productSchema.safeParse( data );

  if ( !parsedProduct.success ) {
    console.log( parsedProduct.error )
    return {
      ok: false,
      message: 'Error, please check the data',
    }

  } else {
    console.log( parsedProduct.data )
  }
}