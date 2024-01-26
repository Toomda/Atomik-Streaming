"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";
import { getSelf } from "../lib/auth-service";

interface UserResponse {
  userId: string;
  email: string;
  token?: string;
}

interface User {
  username: string;
  bio: string;
}

export const registerUser = async (
  username: string,
  password: string,
  email: string
) => {
  if (!email || !username || !password) {
    throw new Error("You need an email, username and password");
  }

  const response = await axios.post(`${process.env.BASE_URL}/user/register`, {
    email,
    username,
    password,
  });

  if (response.status !== 201) {
    throw new Error(
      "Something went wrong, trying to register. Please try again."
    );
  }

  const responseData: UserResponse = response.data;
};

export const loginUser = async (username: string, password: string) => {
  if (!username || !password)
    throw new Error("Pleas provide an email, and a password");

  const response = await axios.post(`${process.env.BASE_URL}/user/login`, {
    username,
    password,
  });

  if (response.status !== 200) {
    throw new Error("Invalid Credentials! Please try again!");
  }

  const responseData: UserResponse = response.data;

  return { userId: responseData.userId, token: responseData.token! };
};

export const deleteUserById = async (id: string) => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.delete(`${process.env.BASE_URL}/user/${self.id}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error("Something went wrong, trying to update the user!");
  }

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }
};

export const updateUser = async (values: Partial<User>) => {
  const self = await getSelf();

  let response;
  try {
    const validData = {
      bio: values.bio,
      username: values.username,
    };

    console.log(validData);
    console.log(values.username);

    response = await axios.patch(
      `${process.env.BASE_URL}/user/${self.id}`,
      validData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {
    throw new Error("Something went wrong, trying to update the user!");
  }

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const updatedUser = response.data.user;

  revalidatePath(`/u/${self.username}`);
  revalidatePath(`/${self.username}`);
  revalidatePath(`/`);

  return updatedUser;
};

export const getUserByUsername = async (username: string) => {
  let response;
  try {
    response = await axios.get(
      `${process.env.BASE_URL}/user/username/${username}`
    );
  } catch (error) {
    throw new Error(
      `Unexpected Error while trying to retrieve the user ${username}`
    );
  }

  return response.data.user;
};

export const getUserById = async (id: string) => {
  let response;
  try {
    response = await axios.get(`${process.env.BASE_URL}/user/${id}`);
  } catch (error) {
    throw new Error(`Unexpected Error while trying to retrieve the user ${id}`);
  }

  return response.data.user;
};
