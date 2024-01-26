"use server";

import { revalidatePath } from "next/cache";

import axios from "axios";
import { getSelf } from "@/lib/auth-service";

export const onFollow = async (id: string) => {
  const self = await getSelf();

  try {
    const response = await axios
      .post(`${process.env.BASE_URL}/follow/${id}`, null, {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      })
      .catch((err) => {
        throw new Error(err.response.statusText);
      });

    revalidatePath("/");
    if (response.data.followed) {
      revalidatePath(`/${response.data.followed}`);
    }

    return response.data.followed;
  } catch (error) {
    throw new Error("Internal Error");
  }
};

export const onUnfollow = async (id: string) => {
  const self = await getSelf();

  try {
    const response = await axios
      .post(`${process.env.BASE_URL}/follow/unfollow/${id}`, null, {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      })
      .catch((err) => {
        throw new Error(err.response.statusText);
      });

    revalidatePath("/");
    if (response.data.followed) {
      revalidatePath(`/${response.data.followed}`);
    }

    return response.data.followed;
  } catch (error) {
    throw new Error("Internal Error");
  }
};

export const isFollowingUser = async (id: string) => {
  let response;
  try {
    const self = await getSelf();

    response = await axios.get(`${process.env.BASE_URL}/follow/${id}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    return false;
  }
  return response.status === 200;
};

export const getFollowedUsers = async () => {
  let self;
  try {
    self = await getSelf();
  } catch (error) {
    return [];
  }

  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/follow`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    return [];
  }
  return response.data.followedUsers;
};
