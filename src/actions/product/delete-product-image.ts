'use server'

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config( process.env.CLOUDINARY_URL as string );


export const deleteProductImage = async ( imageId: number, imageUrl: string ) => {

  // Check if the imageUrl is a valid URL
  if ( !imageUrl.startsWith('http') ) {
    return {
      ok: false,
      message: 'Impossible to delete images from file system',
    }
  }

  // Extract the public_id from the URL
  const imageName = imageUrl.split('/').pop()?.split('.')[0] || '';

  try {
    await cloudinary.uploader.destroy( imageName );
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      select: {
        product: {
          select: {
            slug: true,
          }
        }
      }
    });

    // Revalidate the path to update the cache
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${ deletedImage.product.slug }`);
    revalidatePath(`/product/${ deletedImage.product.slug }`);
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Error deleting image',
    }
    
  }

}