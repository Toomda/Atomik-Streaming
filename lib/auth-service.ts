"use server";

import { currentUser } from "@/lib/auth";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import axios from "axios";
import { redirect } from "next/navigation";

export const getSelf = async () => {
  let self;
  try {
    self = await currentUser();
  } catch (error) {
    throw new Error("Error");
  }
  if (!self || !self.username) {
    throw new Error("Unauthorized");
  }

  try {
    jwt.verify(self.accessToken, "duuxiZ49FqHVL29YEe8Uceu89");
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      redirect(`${process.env.LOCAL_BASE_URL}/api/auth/logout`);
    }
  }

  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/user/${self.id}`);
  } catch (error) {
    throw new Error("Failed getting user");
  }

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
  const user = response.data.user;
  return {
    id: user.id,
    username: user.username,
    image: user.image,
    token: self.accessToken,
  };
};
