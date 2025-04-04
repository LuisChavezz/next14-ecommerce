'use client'

import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useEffect, useState } from "react"


export const PlaceOrder = () => {

  const [loaded, setLoaded] = useState(false)

  // Address store from Zustand
  const address = useAddressStore((state) => state.address)
  const { itemsInCart, subTotal, taxes, total } = useCartStore(state => state.getSummaryInformation())

  useEffect(() => {
    setLoaded(true)
  }, [])

  if (!loaded) {
    return <p>Loading...</p>
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Shipping Address</h2>
      <div className="mb-10">
        <p className="text-xl">{address.firstName} {address.lastName}</p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>{address.city}, {address.country}</p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Order resume</h2>
      <div className="grid grid-cols-2">
        <span>No. Products</span>
        <span className="text-right">{`${itemsInCart} items`}</span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Taxes (15%)</span>
        <span className="text-right">{currencyFormat(taxes)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">By clicking on the Place Order button, you agree to our <a href="#" className="underline">Terms & Condition</a> and <a href="#" className="underline">Privacy Policy</a></span>
        </p>
        <button
          // href="/orders/123" 
          className="flex btn-primary justify-center"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
