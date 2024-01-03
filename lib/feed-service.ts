import { getSelf } from '@/lib/auth-service';
import axios from 'axios';

export const getStreams = async () => {
  let userId;
  try {
    const self = await getSelf();
    userId = self.id;
  } catch (error) {
    userId = null;
  }

  let response;
  try {
    response = await axios.get('http://localhost:5000/api/livestreams/', {
      data: {
        uid: userId,
      },
    });
  } catch (error) {
    throw new Error('Error while retrieving Streams');
  }

  return response.data.streams;
};
