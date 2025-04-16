import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import Image from "next/image";
import { redirect } from "next/navigation";

// Icons
import { IoCardOutline } from "react-icons/io5";


interface Props {
  params: {
    id: string;
  };
}

export default async function CheckoutPage({ params }: Props) {

  const { id } = params;

  const { ok, order } = await getOrderById(id);

  // Check if the user is authenticated
  if (!ok) {
    redirect('/');
  }

  const address = order?.OrderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order #${id.split('-').at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            
            <OrderStatus isPaid={order!.isPaid} />

            {/* Cart Items */}
            {
              order!.OrderItem.map((item, index) => (
                <div key={index} className="flex mb-5">
                  <Image
                    src={`/products/${item.product.ProductImage[0].url}`}
                    alt={item.product.title}
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
                    <p>{item.product.title}</p>
                    <p>${item.price} x {item.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Shipping Address</h2>
            <div className="mb-10">
              <p className="text-xl">{address?.firstName} {address?.lastName}</p>
              <p>{address?.address}</p>
              <p>{address?.address2}</p>
              <p>{address?.postalCode}</p>
              <p>{address?.city}, {address?.countryId}</p>
              <p>{address?.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Order resume</h2>
            <div className="grid grid-cols-2">
              <span>No. Products</span>
              <span className="text-right">{ order?.itemsInOrder } artículos</span>
              <span>Subtotal</span>
              <span className="text-right">{ currencyFormat( order!.subTotal ) }</span>
              <span>Taxes (15%)</span>
              <span className="text-right">{ currencyFormat( order!.tax ) }</span>
              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{ currencyFormat( order!.total ) }</span>
            </div>

            {
              (order!.isPaid) ? (
                <OrderStatus isPaid={ true } />
              ) : (
                <div className="mt-5 mb-2 w-full">
                  <PayPalButton
                    orderId={ order!.id }
                    amount={ order!.total }
                  />
                </div>
              )
            }

          </div>
        </div>
      </div>
    </div>
  );
}