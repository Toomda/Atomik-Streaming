import axios from "axios";
import { getSelf } from "./auth-service";

export const uploadImageByUserId = async (file: File, userId: string) => {
  const self = await getSelf();

  let response;

  try {
    const formData = new FormData();
    formData.append("image", file);

    response = await axios.post(
      `${process.env.NEXT_PUBLIC_RESOURCE_URL}/user/files/upload/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong, uploading the file");
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
    formData.append("image", file);

    response = await axios.post(
      `${process.env.NEXT_PUBLIC_RESOURCE_URL}/stream/files/upload/${streamId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    throw new Error("Something went wrong, uploading the file");
  }
};
