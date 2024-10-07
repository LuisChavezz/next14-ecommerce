import NextAuth, { type NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  providers: [
    credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

          if ( !parsedCredentials.success ) return null;

          const { username, password } = parsedCredentials.data;

          console.log({ username, password });

          return null;
      }
    })
  ]
} 

export const { signIn, signOut, auth } = NextAuth( authConfig );