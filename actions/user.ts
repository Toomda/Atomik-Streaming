import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import axios from 'axios';
import { getSelf } from '../lib/auth-service';

interface UserResponse {
  userId: string;
  email: string;
  token?: string;
}

interface User {
  username: string;
  bio: string;
  image: string;
}

export const updateUser = async (values: Partial<User>) => {
  const self = await getSelf();

  const validData = {
    bio: values.bio,
    username: values.username,
    image: values.image,
  };

  if (validData.username === '' || validData.username === null) {
    throw new Error('Username is required');
  }

  const user = await db.user.update({
    where: { id: self.id },
    data: {
      ...validData,
    },
  });

  revalidatePath(`/u/${self.username}`);
  revalidatePath(`/${self.username}`);
  revalidatePath(`/`);

  return user;
};

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

// export const deleteUserById = async (id: string, password: string) => {
//   if (!id || !password) {
//     throw new Error('Please provide an id and a pasword');
//   }

//   const user = await db.user.findUnique({
//     where: { id },
//   });

//   if (!user) {
//     throw new Error('User not found');
//   }

//   const passwordIsCorrect = await bcrypt.compare(password, user.password);

//   if (passwordIsCorrect) {
//     await db.user.delete({ where: { id: user.id } });
//     await signOut();
//   } else {
//     throw new Error('Password was not correct');
//   }
// };
