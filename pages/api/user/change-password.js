import {getServerSession} from 'next-auth';

import {hashPassword, verifyPassword} from '../../../lib/auth';
import {connectToDatabase} from '../../../lib/db';
import {authOptions} from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({message: 'Not authenticated!'});
  }

  const userEmail = session.user.email;

  const {oldPassword, newPassword} = req.body;

  const client = await connectToDatabase();

  const db = client.db();

  const user = await db.collection('users').findOne({email: userEmail});

  if (!user) {
    client.close();
    return res.status(404).json({message: 'User not found.'});
  }

  const isMatch = await verifyPassword(oldPassword, user.password);

  if (!isMatch) {
    client.close();
    return res.status(403).json({message: 'Invalid credentials!'});
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await db
    .collection('users')
    .updateOne({email: userEmail}, {$set: {password: hashedPassword}});

  client.close();
  res.status(200).json({message: 'Password updated successfully.'});
}
