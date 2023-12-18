"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { registerUser } from "@/actions/user";

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await registerUser(username, password);
      await signIn("credentials", {
        username: username,
        password: password,
      });
    });
  };

  return (
    <div className="p-4 rounded-xl items-center flex flex-col bg-background">
      <form onSubmit={onSubmit} className="flex flex-col mb-4">
        <div>
          <p className="text-muted-foreground justify-start p-1">Username</p>
          <Input
            className="mb-4"
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
          />
        </div>
        <div>
          <p className="text-muted-foreground justify-start p-1">Password</p>
          <Input
            className="mb-4"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
          />
        </div>
        <Button size="sm" variant="primary" type="submit" disabled={isPending}>
          Register
        </Button>
      </form>
    </div>
  );
};
