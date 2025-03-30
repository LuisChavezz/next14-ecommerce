'use server'

import { signIn } from "@/auth.config"
import { sleep } from "@/utils";


export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {

  try {
    
    // await sleep( 2 );

    await signIn( 'credentials', {
      ...Object.fromEntries( formData ),
      redirect: false,
    });

    return 'Success';
    
  } catch (error) {
    
    return 'CredentialsSignIn';

  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return {
      ok: true,
      message: 'Login successful',
    }
    
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Login failed',
    }
  }
}