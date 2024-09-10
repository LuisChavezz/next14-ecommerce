'use client'

import { QuantitySelector, SizeSelector } from "@/components"
import { Product, Size } from "@/interfaces"
import { useState } from "react"


interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  
  const [size, setSize] = useState<Size | undefined>()
  const [quantity, setQuantity] = useState<number>(1)
  const [posted, setPosted] = useState<boolean>( false )

  const addToCart = () => {
    setPosted( true )

    if ( !size || !quantity ) return;

    console.log('Adding to cart:', { size, quantity })
  }

  return (
    <>
      {/* Size selected validation */}
      { ( posted && !size ) && (
        <span className="mt-2 text-red-500">
          Debe de seleccionar una talla.
        </span>
      )}

      {/* Size selector */}
      <SizeSelector 
        availableSizes={ product.sizes } 
        selectedSize={ size } 
        onSizeChange={ setSize } 
      />

      {/* Quantity selector */}
      <QuantitySelector 
        quantity={ quantity } 
        onQuantityChange={ setQuantity }
        inStock={ product.inStock } 
      />

      {/* Add to cart button */}
      <div 
        onClick={ addToCart }
        className="btn-primary my-5"
      >
        Add to cart
      </div>
    </>
  )
}
