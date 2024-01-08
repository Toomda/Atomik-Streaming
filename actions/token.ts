'use server';

import { v4 } from 'uuid';
import { getSelf } from '@/lib/auth-service';
import { getUserById } from './user';
import jwt from 'jsonwebtoken';

export const createViewerToken = async (hostIdentity: string) => {
  let self;
  try {
    self = await getSelf();
  } catch (error) {
    const id = v4();
    self = { id };
  }

  const host = await getUserById(hostIdentity);
  if (!host) {
    throw new Error('User not found');
  }

  const isHost = self.id === host.id;

  let tokenData;
  if (self.username) {
    tokenData = {
      identity: isHost ? `host-${self.id}` : self.id,
      name: self.username,
    };
  } else {
    tokenData = {
      identity: isHost ? `host-${self.id}` : self.id,
    };
  }

  const token = jwt.sign(tokenData, process.env.VIEWER_TOKEN_KEY!);

  return await Promise.resolve(token);
};
