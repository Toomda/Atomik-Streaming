'use server';

import { revalidatePath } from 'next/cache';
import axios from 'axios';
import { getSelf } from '../lib/auth-service';
import { signOut } from 'next-auth/react';

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
    throw new Error('You need an email, username and password');
  }

  const response = await axios.post('http://localhost:5000/api/user/register', {
    email,
    username,
    password,
  });

  if (response.status !== 201) {
    throw new Error(
      'Something went wrong, trying to register. Please try again.'
    );
  }

  const responseData: UserResponse = response.data;
};

export const loginUser = async (username: string, password: string) => {
  if (!username || !password)
    throw new Error('Pleas provide an email, and a password');

  const response = await axios.post('http://localhost:5000/api/user/login', {
    username,
    password,
  });

  if (response.status !== 200) {
    throw new Error('Invalid Credentials! Please try again!');
  }

  const responseData: UserResponse = response.data;

  return { userId: responseData.userId, token: responseData.token! };
};

export const deleteUserById = async (id: string) => {
  const self = await getSelf();

  let response;
  try {
    response = await axios.delete(`http://localhost:5000/api/user/${self.id}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    throw new Error('Something went wrong, trying to update the user!');
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
      `http://localhost:5000/api/user/${self.id}`,
      validData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {
    throw new Error('Something went wrong, trying to update the user!');
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
