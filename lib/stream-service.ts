import axios from 'axios';

export const getStreamByUserId = async (userId: string) => {
  let response;
  try {
    response = await axios.get(
      `http://localhost:5000/api/livestreams/${userId}`
    );
  } catch (error) {
    throw new Error(`Could not get Livestream for userId ${userId}`);
  }

  return response.data.stream;
};
