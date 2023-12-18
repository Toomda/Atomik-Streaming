"use server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth, signOut } from "@/next-auth";

export const updateUser = async (values: Partial<User>) => {
  const self = await getSelf();

  const validData = {
    bio: values.bio,
    username: values.username,
    image: values.image,
  };

  if (validData.username === "" || validData.username === null) {
    throw new Error("Username is required");
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

export const registerUser = async (username: string, password: string) => {
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      username: username,
      password: hashPassword,
      stream: {
        create: {
          name: `${username}'s Stream`,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return user;
};

export const deleteUserById = async (id: string, password: string) => {
  if (!id || !password) {
    throw new Error("Please provide an id and a pasword");
  }

  const user = await db.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (passwordIsCorrect) {
    await db.user.delete({ where: { id: user.id } });
    await signOut();
  } else {
    throw new Error("Password was not correct");
  }
};
