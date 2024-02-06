"use server";
import axios from "axios";
import { getSelf } from "../lib/auth-service";

export const getVODs = async () => {
  let self;

  try {
    self = await getSelf();
  } catch (error) {
    throw new Error("You are not authorized!");
  }

  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/vod/all/${self.id}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error("Error while trying to retrieve the VODs");
  }

  return response.data;
};
