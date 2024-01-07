import axios from 'axios';
import { getSelf } from './auth-service';

export const getStreamByUserId = async (userId: string) => {
  let response;
  try {
    response = await axios.get(`http://localhost:5000/api/stream/${userId}`);
  } catch (error) {
    throw new Error(`Could not get Livestream for userId ${userId}`);
  }

  return response.data.stream;
};

export const getStreamKeyByUserId = async (userId: string) => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.get(
      `http://localhost:5000/api/streamkey/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {
    throw new Error(`Could not get Streamkey for userId ${userId}`);
  }

  return response.data.stream;
};
