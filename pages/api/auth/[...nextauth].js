import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import {verifyPassword} from '../../../lib/auth';
import {connectToDatabase} from '../../../lib/db';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      // credentials:{} //default nextauth form
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('No User Found.');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          client.close();
          throw new Error('Invalid credentials');
        }

        client.close();
        return {email: user.email};
      },
    }),
  ],
});
