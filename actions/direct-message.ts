"use server";

import { getSelf } from "@/lib/auth-service";
import axios from "axios";

export const getDirectMessages = async () => {
  let self;

  try {
    self = await getSelf();
  } catch (error) {
    return [];
  }

  let response;

  try {
    response = await axios.get(`${process.env.BASE_URL}/directMessage/`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error("Error while trying to retrieve DM's");
  }

  return response.data;
};
