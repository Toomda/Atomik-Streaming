import { currentUser } from '@/lib/auth';

import axios from 'axios';

export const getSelf = async () => {
  const self = await currentUser();

  if (!self || !self.username) {
    throw new Error('Unauthorized');
  }

  let response;
  try {
    response = await axios.get(`http://localhost:5000/api/user/${self.id}`);
  } catch (error) {
    throw new Error('Failed getting user');
  }

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const user = response.data.user;

  return {
    id: user.id,
    username: user.username,
    image: user.image,
    token: self.accessToken,
  };
};
