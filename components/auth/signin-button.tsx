"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SignInButton = () => {
  return (
    <Button variant="primary" size="sm">
      <Link href="/login">Login</Link>
    </Button>
  );
};
