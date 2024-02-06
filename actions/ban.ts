"use server";

import { getSelf } from "@/lib/auth-service";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const onBan = async (userId: string, hostname: string) => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.post(
      `${process.env.BASE_URL}/ban/${userId}`,
      {
        hostname,
      },
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {
    throw new Error("Error while trying to ban the user");
  }

  revalidatePath(`/u/${self.username}/community`);

  return response.data;
};

export const onUnban = async (userId: string) => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.post(
      `${process.env.BASE_URL}/ban/unban/${userId}`,
      {
        hostname: self.username,
      },
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {
    throw new Error("Error while trying to unban the user.");
  }

  revalidatePath(`/u/${self.username}/community`);

  return response.data;
};

export const getBannedUsers = async () => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/ban/`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error("Error while getting banned Users.");
  }

  return response.data.bans;
};

export const isBannedByUser = async (username: string) => {
  let self;

  try {
    self = await getSelf();
  } catch (error) {
    return;
  }

  let response;

  try {
    response = await axios.get(`${process.env.BASE_URL}/ban/${username}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error("Error while getting ban");
  }

  return response.data.banned;
};
