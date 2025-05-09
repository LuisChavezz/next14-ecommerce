import NextAuth, { type NextAuthConfig } from 'next-auth';
import credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';


const PROTECTED_PATHS = [
  { path: '/checkout', allowedRoles: ['user', 'admin'] },
  { path: '/orders', allowedRoles: ['user', 'admin'] },
  { path: '/admin', allowedRoles: ['admin'] },
]
 
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  callbacks: {
    authorized({ auth, request: { nextUrl }}) {
      
      const role = auth?.user?.role ?? 'guest';
      const protectedPath = PROTECTED_PATHS.find(({ path }) => nextUrl?.pathname.includes(path));
      const canAccessPath = !protectedPath || protectedPath?.allowedRoles.includes(role);
      return canAccessPath;   

    },

    async jwt({ token, user }) {
      if ( user ) {
        token.data = user;
      }

      return token;
    },

    async session({ session, token, user }) {
      session.user = token.data as any;

      return session;
    }

  },

  providers: [
    credentials({
      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = z
          .object({
            email: z.string(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

          // Credentials are invalid
          if ( !parsedCredentials.success ) return null;

          // Credentials are valid
          const { email, password } = parsedCredentials.data;

          // Search the email in the database
          const user = await prisma.user.findUnique({ where: { email: email.toLocaleLowerCase() } });

          // Check if the user exists
          if ( !user ) return null;

          // Check if the password is correct
          if ( !bcryptjs.compareSync(password, user.password) ) return null;

          const { password: _, ...rest } = user;
          console.log(rest);
          return rest;
      }
    })
  ]
} 

export const { signIn, signOut, auth, handlers } = NextAuth( authConfig );