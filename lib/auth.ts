import { useSession as useNextAuthSession } from "next-auth/react";
import { auth } from "@/next-auth";

export const useAuth = () => {
  const session = useNextAuthSession();

  return session.data?.user;
};

export const useUser = () => {
  const session = useNextAuthSession();

  return session.data?.user;
};

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};
