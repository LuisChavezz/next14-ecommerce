'use client';

import { useEffect, useState } from "react";
import { QuantitySelector } from "@/components/product/quantity-selector/QuantitySelector";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/components/product/product-image/ProductImage";


export const ProductsInCart = () => {

  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore((state) => state.updateProductQuantity);
  const removeProduct = useCartStore((state) => state.removeProduct);

  useEffect(() => {
    setLoaded(true)
  }, [])
  

  if (!loaded) {
    return ( <div>Loading...</div> )
  }

  return (
    <>
      {/* Cart Items */}
      {
        productsInCart.map((product) => (
          <div key={ `${ product.slug }-${ product.size }` } className="flex mb-5">
            <ProductImage
              src={ product.image }
              alt={ product.title }
              width={100}
              height={100}
              style={{
                objectFit: "contain",
                width: 'auto',
                height: 'auto',
              }}
              className="mr-5 rounded"
            />
            <div>
              <Link 
                className="hover:underline cursor-pointer"
                href={`/product/${ product.slug }`}
              >
                { product.size } - { product.title }
              </Link>
              
              <p>${product.price}</p>
              <QuantitySelector 
                // inStock={ product.inStock } 
                quantity={ product.quantity }
                onQuantityChange={ (quantity) => updateProductQuantity(product, quantity) } 
              />
              <button 
                className="underline mt-3"
                onClick={ () => removeProduct(product) }
              >
                Remove
              </button>
            </div>
          </div>
        ))
      }
    </>
  )
}
