"use server";

import axios, { AxiosResponse } from "axios";

export const getRoomInformation = async (hostname: string) => {
  let response: AxiosResponse;
  try {
    response = await axios.get(`${process.env.BASE_URL}/room/${hostname}`);
  } catch (error) {
    throw new Error("Could not get Room info");
  }

  return response.data;
};
