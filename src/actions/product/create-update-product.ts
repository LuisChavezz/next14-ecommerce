'use server'

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
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


export const createOrUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const parsedProduct = productSchema.safeParse(data);

  // Check if the data is valid
  if (!parsedProduct.success) {
    console.log(parsedProduct.error)
    return {
      ok: false,
      message: 'Error, please check the data',
    }
  }

  const product = parsedProduct.data; // productSchema.parse(data)
  product.slug = product.slug.toLowerCase().replace(/ /g, '_').trim() // replace spaces with underscores
  const { id, ...restProduct } = product;

  try {
    // Prisma transaction to create or update the product
    const prismaTx = await prisma.$transaction(async (tx) => {

      let product: Product;
      const tagsArray = restProduct.tags.split(',').map((tag) => tag.trim()); // set the tags

      if (id) {
        // Update product
        product = await tx.product.update({
          where: { id },
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[], // set the sizes
            },
            tags: {
              set: tagsArray,
            }
          },
        });


      } else {
        // Create product
        product = await prisma.product.create({
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[], // set the sizes
            },
            tags: {
              set: tagsArray,
            }
          },
        })
      }

      return { product }
    })

    // Revalidate paths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return {
      ok: true,
      message: 'Product created/updated successfully',
      product: prismaTx.product,
    }

  } catch (error) {
    console.log('Error creating/updating product:', error);
    return {
      ok: false,
      message: 'Error creating/updating product',
    }
  }
}