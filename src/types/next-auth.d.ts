import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
      department?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
    department?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'USER' | 'REVIEWER' | 'ADMIN' | 'SUPER_ADMIN';
    department?: string;
  }
}
