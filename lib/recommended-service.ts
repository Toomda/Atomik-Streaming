import { getSelf } from '@/lib/auth-service';
import axios from 'axios';

export const getRecommended = async () => {
  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    userId = null;
  }

  let response;
  try {
    response = await axios.get('http://localhost:5000/api/user/recommended', {
      data: {
        uid: userId,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error while getting recommended Users');
  }

  return response.data.users;
};
