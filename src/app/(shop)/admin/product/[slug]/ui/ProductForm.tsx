"use client";

import { createOrUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage as ProductImageComponent } from "@/components";
import { Category, Product, ProductImage } from "@/interfaces";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductImage[] };
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  tags: string;
  inStock: number;
  sizes: string[];
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter();

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(', '),
      sizes: product.sizes || [],
      images: undefined,
    }
  });

  // Watch the sizes field to see if it changes
  watch('sizes');

  // Handle the size change - add or remove size
  const onSizeChange = ( size: string ) => {
    const currentSizes = new Set(getValues('sizes')); // Get current sizes as a Set (to avoid duplicates)
    
    // Check if the size is already selected
    currentSizes.has( size )
      ? currentSizes.delete( size ) // Remove size if it exists
      : currentSizes.add( size ); // Add size if it doesn't exist

    setValue('sizes', Array.from( currentSizes )); // Convert Set back to array and set the value
  }

  // Handle form submission
  const onSubmit = async ( data: FormInputs ) => {
    
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if ( product.id ) {
      formData.append('id', product.id ?? '');
    }
    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('inStock', data.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    if ( images ) {
      for ( let i = 0; i < images.length; i++ ) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: updatedProduct } = await createOrUpdateProduct( formData )

    if ( !ok ) {
      return alert('Error, please check the data');
    }

    router.replace( `/admin/product/${ updatedProduct?.slug }` )

  }


  return (
    <form onSubmit={ handleSubmit( onSubmit ) } className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input 
            type="text" 
            className="p-2 border rounded-md bg-gray-200" 
            { ...register('title', { required: true }) }
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input 
            type="text" 
            className="p-2 border rounded-md bg-gray-200" 
            { ...register('slug', { required: true }) }
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            { ...register('description', { required: true }) }
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input 
            type="number" 
            className="p-2 border rounded-md bg-gray-200" 
            
            { ...register('price', { required: true, min: 0 }) }
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input 
            type="text" 
            className="p-2 border rounded-md bg-gray-200" 
            { ...register('tags', { required: true }) }
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select 
            className="p-2 border rounded-md bg-gray-200"
            { ...register('gender', { required: true }) }
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select 
            className="p-2 border rounded-md bg-gray-200"
            { ...register('categoryId', { required: true }) }  
          >
            <option value="">[Seleccione]</option>
            {
              categories.map( category => (
                <option key={ category.id } value={ category.id }>
                  { category.name }
                </option>
              ))
            }
          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        
        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input 
            type="number" 
            className="p-2 border rounded-md bg-gray-200" 
            
            { ...register('inStock', { required: true, min: 0 }) }
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div 
                key={ size } 
                onClick={ () => onSizeChange( size ) }
                className={
                  clsx(
                    "p-2 border rounded-md mr-2 mb-2 w-14 text-center  cursor-pointer transition-all",
                    {
                      'bg-blue-500 text-white': getValues('sizes').includes( size ),
                    }
                  )
                }

                >
                  <span>{ size }</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input 
              type="file"
              multiple 
              className="p-2 border rounded-md bg-gray-200" 
              accept="image/png, image/jpeg, image/avif"
              { ...register('images') }
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map( image => (
                <div key={ image.id }>
                  <ProductImageComponent
                    src={ image.url }
                    alt={ product.title ?? '' }
                    width={ 300 }
                    height={ 300 }
                    className="rounded-t-md shadow-md"
                    priority
                  />
                  <button 
                    type="button"
                    onClick={ () => deleteProductImage( image.id, image.url )}
                    className="btn-danger rounded-b-xl w-full"
                  >
                    Delete
                  </button>
                </div>
              ))

            }
          </div>

        </div>
      </div>
    </form>
  );
};