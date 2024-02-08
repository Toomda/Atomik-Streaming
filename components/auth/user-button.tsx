import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "../user-avatar";
import { getSelf } from "@/lib/auth-service";
import { signOut } from "@/next-auth";
import { LogOut } from "lucide-react";
import { SettingsModal } from "./settings-modal";
import { DeleteModal } from "./delete-modal";
import { getUserById } from "@/actions/user";

export const UserButton = async ({ props }: any) => {
  const self = await getSelf();
  const user = await getUserById(self.id);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar username={user.username!} userId={user.id} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>{user.username!}</DropdownMenuLabel>
        <SettingsModal user={user} initialUsername={user.username} />
        <DropdownMenuSeparator />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </form>
        <DropdownMenuSeparator />
        <DeleteModal userId={user.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
