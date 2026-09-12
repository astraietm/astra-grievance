import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'astra_super_secret_jwt_key_2026',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // 1. Google OAuth Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'select_account',
                ...(process.env.GOOGLE_ALLOWED_DOMAIN
                  ? { hd: process.env.GOOGLE_ALLOWED_DOMAIN }
                  : {}),
              },
            },
          }),
        ]
      : []),

    // 2. Dev Credentials Provider (For local development/testing without Google OAuth setup)
    ...(process.env.ENABLE_DEV_LOGIN !== 'false'
      ? [
          CredentialsProvider({
            id: 'credentials',
            name: 'Development Login',
            credentials: {
              email: { label: 'Email', type: 'email', placeholder: 'admin@astraietm.in' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
              if (!credentials?.email || !credentials?.password) {
                throw new Error('Email and password required.');
              }

              const user = await prisma.user.findUnique({
                where: { email: credentials.email.toLowerCase().trim() },
              });

              if (!user || !user.passwordHash) {
                throw new Error('Invalid credentials.');
              }

              const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
              if (!isValid) {
                throw new Error('Invalid credentials.');
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name || user.email.split('@')[0],
                role: user.role as 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN',
                department: user.department || 'Cyber Security',
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;

        // Check Google Workspace Domain restriction if configured
        const allowedDomain = process.env.GOOGLE_ALLOWED_DOMAIN?.trim();
        if (allowedDomain) {
          const emailDomain = user.email.split('@')[1];
          if (emailDomain !== allowedDomain) {
            console.warn(`Denied login for ${user.email}: domain does not match ${allowedDomain}`);
            return false;
          }
        }

        // Upsert user in database
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase() },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              googleUserId: account.providerAccountId,
              email: user.email.toLowerCase(),
              name: user.name || user.email.split('@')[0],
              role: 'USER',
              department: 'Cyber Security',
            },
          });
        } else if (!dbUser.googleUserId) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { googleUserId: account.providerAccountId },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Fetch fresh database record to ensure correct Role
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role as 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
          token.department = dbUser.department || 'Cyber Security';
          token.name = dbUser.name;
          token.email = dbUser.email;
        }
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
        session.user.department = token.department as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
