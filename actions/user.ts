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

function base64ToFile(base64String: string, filename: string) {
  // Decode the Base64 string
  const byteString = atob(base64String.split(',')[1]);
  // Create an array buffer and a view (as a byte array)
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }

  // Create a blob from the byte array
  const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
  // Create a file from the blob
  const file = new File([blob], filename, { type: 'image/jpeg' });

  return file;
}
