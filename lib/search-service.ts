import { getSelf } from '@/lib/auth-service';
import axios from 'axios';

export const getSearch = async (term?: string) => {
  let userId;

  try {
    const self = await getSelf();
    userId = self.id;
  } catch (error) {
    userId = null;
  }

  let response;
  try {
    response = await axios.get(
      `http://localhost:5000/api/stream/search/${term}`,
      {
        data: {
          uid: userId,
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error('Error while trying to get the search');
  }

  return response.data.streams;
};
