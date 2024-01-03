import axios from 'axios';
import { getSelf } from './auth-service';

export const uploadImageByUserId = async (file: File, userId: string) => {
  const self = await getSelf();

  let response;

  try {
    const formData = new FormData();
    formData.append('image', file);

    response = await axios.post(
      `http://localhost:5000/api/user/files/upload/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } catch (error) {
    throw new Error('Something went wrong, uploading the file');
  }

  return response;
};

export const uploadThumbnailByStreamId = async (
  file: File,
  streamId: string
) => {
  const self = await getSelf();

  let response;
  try {
    const formData = new FormData();
    formData.append('image', file);

    response = await axios.post(
      `http://localhost:5000/api/livestreams/files/upload/${streamId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } catch (error) {
    throw new Error('Something went wrong, uploading the file');
  }
};
