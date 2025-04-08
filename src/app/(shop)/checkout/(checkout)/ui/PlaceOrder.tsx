'use client'

import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat, sleep } from "@/utils"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


export const PlaceOrder = () => {

  const router = useRouter()

  // State to manage loading and error messages
  const [loaded, setLoaded] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Address store from Zustand
  const address = useAddressStore((state) => state.address)

  // Cart total information from Zustand
  const { itemsInCart, subTotal, taxes, total } = useCartStore(state => state.getSummaryInformation())

  // Cart store from Zustand
  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const onPlaceOrder = async() => {
    setIsPlacingOrder(true)
    // await sleep(2)

    // Product information to be sent to the server
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }))

    // Server action to place the order
    const resp = await placeOrder( productsToOrder, address )
    if ( !resp.ok ) {
      setIsPlacingOrder(false)
      setErrorMessage( resp.message )
      return
    }

    // Clear the cart
    clearCart()
    router.replace('/orders/' + resp.order?.id )
  }

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

        <p className="text-red-500">{ errorMessage }</p>

        <button
          // href="/orders/123" 
          disabled={ isPlacingOrder }
          onClick={ onPlaceOrder }
          className={
            clsx({
              'btn-primary': !isPlacingOrder,
              'btn-disabled': isPlacingOrder,
            })
          }
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
