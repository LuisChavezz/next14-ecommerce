'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils";
import { useState, useEffect } from 'react';


export const OrderSummary = () => {

  const [laoded, setLoaded] = useState(false)
  const { itemsInCart, subTotal, taxes, total } = useCartStore(state => state.getSummaryInformation())

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!laoded) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-2">
      <span>No. Products</span>
      <span className="text-right">{ `${ itemsInCart } artículos` }</span>

      <span>Subtotal</span>
      <span className="text-right">{ currencyFormat( subTotal ) }</span>

      <span>Taxes (15%)</span>
      <span className="text-right">{ currencyFormat( taxes ) }</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">{ currencyFormat( total ) }</span>
    </div>
  )
}
