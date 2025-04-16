'use client'

import { PayPalButtons, PayPalButtonsComponentProps, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions"


interface Props {
  orderId: string
  amount: number
}

export const PayPalButton = ({ orderId, amount }: Props) => {

  const [{ isPending }] = usePayPalScriptReducer()

  const rountedAmount = ( Math.round( amount * 100 ) / 100 ).toFixed( 2 )

  if ( isPending ) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-11 bg-gray-300 rounded" />  
        <div className="h-11 bg-gray-300 rounded" />
      </div>
    )
  }

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async (data, actions): Promise<string> => {

    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: 'USD',
            value: rountedAmount
          }
        }
      ],
      intent: 'CAPTURE',
    })
    
    const { ok } = await setTransactionId( orderId, transactionId )
    if ( !ok ) {
      throw new Error('Error updating order')
    }

    return transactionId
  }

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
    const details = await actions.order?.capture()
    if ( !details ) return

    // TODO: server action 'paypalCheckPayment'
    await paypalCheckPayment( details.id! )
  }

  return (
    <div className="relative z-0">
      <PayPalButtons 
        createOrder={  createOrder }
        onApprove={ onApprove }
      />
    </div>
  )
}
