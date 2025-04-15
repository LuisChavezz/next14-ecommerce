'use server'

import { PayPalOrderStarusResponse } from "@/interfaces"
import prisma from "@/lib/prisma"


export const paypalCheckPayment = async (paypalTransactionId: string) => {

  // Authenticate with PayPal
  const authToken = await getPaypalBearerToken()
  console.log({ authToken })

  // Check if we have a token
  if (!authToken) {
    return {
      ok: false,
      message: 'No token'
    }
  }

  // Verify the payment with PayPal
  const response = await verifyPayPalPayment(paypalTransactionId, authToken)

  // Check if we have a response
  if (!response) {
    return {
      ok: false,
      message: 'No response'
    }
  }

  const { status, purchase_units } = response
  // const {  } = purchase_units[0] // TODO: invoice ID

  // Check if the status is 'COMPLETED'
  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Payment not completed'
    }
  }

  // Update the order in the database
  try {
    console.log({ status, purchase_units })

    await prisma.order.update({
      where: {
        id: 'b470e31a-afde-4b93-ad01-e4342cfaa64b'
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      }
    })

    // Revalidate a path

    
  } catch (error) {
    console.error('Error updating order', error)
    return {
      ok: false,
      message: '500 - Error updating order'
    }
    
  }


}

const getPaypalBearerToken = async (): Promise<string | null> => {

  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? ''

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64')

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    `Basic ${base64Token}`
  );

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const response = await fetch(oauth2Url, {
      ...requestOptions,
      cache: "no-store"
    }).then(resp => resp.json())
    return response.access_token

  } catch (error) {
    console.error("Error fetching PayPal token:", error);
    return null

  }
}

const verifyPayPalPayment = async (
  paypalTransactionId: string, 
  bearerToken: string
): Promise<PayPalOrderStarusResponse|null> => {

  const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ paypalTransactionId }`

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization", 
    `Bearer ${bearerToken}`
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store"
    }).then(resp => resp.json())
    return response
    
  } catch (error) {
    console.error("Error verifying PayPal payment:", error);
    return null
  }
}