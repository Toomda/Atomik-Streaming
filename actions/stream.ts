"use server";

import { revalidatePath } from "next/cache";

import { getSelf } from "@/lib/auth-service";
import axios from "axios";

interface Stream {
  thumbnail: string;
  name: string;
  isChatDelayed: boolean;
  isChatEnabled: boolean;
  isChatFollowersOnly: boolean;
  categoryId: string;
}

export const updateStream = async (values: Partial<Stream>) => {
  const self = await getSelf();

  let response;
  response = await axios
    .post(
      `${process.env.BASE_URL}/stream/${self.id}`,
      {
        thumbnail: values.thumbnail,
        name: values.name,
        isChatDelayed: values.isChatDelayed,
        isChatEnabled: values.isChatEnabled,
        isChatFollowersOnly: values.isChatFollowersOnly,
        categoryId: values.categoryId,
      },
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    )
    .catch((err) => {
      console.log(err.response.status);
      console.log(err.response.statusText);
      throw new Error(err.response.statusText);
    });

  revalidatePath(`/u/${self.username}/chat`);
  revalidatePath(`/u/${self.username}`);
  revalidatePath(`/${self.username}`);
  revalidatePath(`/`);

  return response.data.stream;
};

export const getStreamKeyByUserId = async (userId: string) => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/streamkey/${userId}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error(`Could not get Streamkey for userId ${userId}`);
  }

  return response.data.stream;
};

export const getStreamByUserId = async (userId: string) => {
  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/stream/${userId}`);
  } catch (error) {
    throw new Error(`Could not get Livestream for userId ${userId}`);
  }

  return response.data.stream;
};

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
    response = await axios.get(`${process.env.BASE_URL}/stream/`, {
      data: {
        uid: userId,
      },
    });
  } catch (error) {
    throw new Error("Error while retrieving Streams");
  }

  return response.data.streams;
};

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
    response = await axios.get(`${process.env.BASE_URL}/user/recommended`, {
      data: {
        uid: userId,
      },
    });
  } catch (error) {
    console.log(error);
    return [];
  }

  return response.data.users;
};

export const getFollowedStreams = async () => {
  let self;
  try {
    self = await getSelf();
  } catch {
    return [];
  }

  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/stream/followed/all`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error while getting recommended Users");
  }

  return response.data.streams;
};
