"use server";

import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";
import axios from "axios";

export const createIngress = async () => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.get(
      `${process.env.BASE_URL}/streamkey/generate/${self.id}`,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {}

  if (!response || !response.data || response.status !== 200) {
    throw new Error("An unexpected Error occured!");
  }

  revalidatePath(`/u/${self.username}/keys`);

  return "";
};
