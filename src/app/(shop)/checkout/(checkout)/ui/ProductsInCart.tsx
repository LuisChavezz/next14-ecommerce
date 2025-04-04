'use client';

import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import Image from "next/image";
import { currencyFormat } from "@/utils";


export const ProductsInCart = () => {

  const [loaded, setLoaded] = useState(false)
  const productsInCart = useCartStore((state) => state.cart);

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
            <Image
              src={`/products/${ product.image }`}
              alt={product.title}
              width={100}
              height={100}
              style={{
                objectFit: "contain",
                width: 'auto',
                height: 'auto',
              }}
              className="mr-5 rounded"
              priority
            />
            <div>
              <span>
                { product.size } - { product.title } ({ product.quantity })
              </span>
              
              <p className="font-bold">{ currencyFormat( product.price * product.quantity ) }</p>
            </div>
          </div>
        ))
      }
    </>
  )
}
