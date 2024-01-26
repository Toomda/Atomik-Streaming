"use client";

import { onUnban } from "@/actions/ban";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UnblockButtonProps {
  userId: string;
}

export const UnblockButton = ({ userId }: UnblockButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      onUnban(userId)
        .then((result: any) => {
          toast.success(`${result.user.username} unbanned`);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Button
      className="text-blue-500 w-full"
      onClick={onClick}
      disabled={isPending}
      size="sm"
      variant="link"
    >
      Unblock
    </Button>
  );
};
