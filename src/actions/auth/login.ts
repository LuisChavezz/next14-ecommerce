'use server'

import { signIn } from "@/auth.config"
import { sleep } from "@/utils";


export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {

  try {
    
    // await sleep( 2 );

    await signIn( 'credentials', Object.fromEntries( formData ) );
    
  } catch (error) {
    // if ((error as Error).message.includes('CredentailsSign')) {
    //   return 'CredentailsSign';
    // }
    // throw error;

    return 'CredentailsSign';

  }
}