import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";


const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verify Order" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Move elements</span>
            <Link href="/cart" className="underline mb-5">
              Edit Cart
            </Link>

            {/* Cart Items */}
            {
              productsInCart.map((product) => (
                <div key={ product.slug } className="flex mb-5">
                  <Image
                    src={ `/products/${ product.images[0] }` }
                    alt={ product.title }
                    width={ 100 }
                    height={ 100 }
                    style={{
                      objectFit: "contain",
                      width: 'auto',
                      height: 'auto',
                    }}
                    className="mr-5 rounded"
                    priority
                  />
                  <div>
                    <p>{ product.title }</p>
                    <p>${ product.price } x 3</p>
                    <p className="font-bold">Subtotal: ${ product.price * 3 }</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Shipping Address</h2>
            <div className="mb-10">
              <p className="text-xl">FernanGod Herrera</p>
              <p>Av. 1ra. de Mayo 123</p>
              <p>Col. Centro</p>
              <p>CP 12345</p>
              <p>Guadalajara, México</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Order resume</h2>
            <div className="grid grid-cols-2">
              <span>No. Products</span>
              <span className="text-right">3 artículos</span>
              <span>Subtotal</span>
              <span className="text-right">$ 100</span>
              <span>Taxes (15%)</span>
              <span className="text-right">3 artículos</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">3 artículos</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <p className="mb-5">
                {/* Disclaimer */}
                <span className="text-xs">By clicking on the Place Order button, you agree to our <a href="#" className="underline">Terms & Condition</a> and <a href="#" className="underline">Privacy Policy</a></span>
              </p>
              <Link href="/orders/123" className="flex btn-primary justify-center">
                Place Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}