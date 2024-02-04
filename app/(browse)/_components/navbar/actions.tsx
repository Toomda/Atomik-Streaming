import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/auth/signin-button";
import { UserButton } from "@/components/auth/user-button";
import { currentUser } from "@/lib/auth";
import { Clapperboard, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SignUpButton } from "@/components/auth/signup-button";
import { DirectMessageButton } from "@/components/direct-message-button";

export const Actions = async () => {
  const user = await currentUser();

  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
      {!user && (
        <div>
          <SignInButton />
          <SignUpButton />
        </div>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <DirectMessageButton username={user.username} />
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${user.username}`}>
              <Clapperboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
};
