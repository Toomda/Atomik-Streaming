import { Button } from "@/components/ui/button";
import Link from "next/link";

export const SignUpButton = () => {
  return (
    <Button variant="secondary" size="sm">
      <Link href="/register">Register</Link>
    </Button>
  );
};
