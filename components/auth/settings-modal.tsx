"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition, useRef, ElementRef } from "react";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import ImageUpload from "../image-upload";
import { uploadImageByUserId } from "@/lib/upload-service";
import { useCachebust } from "@/store/use-cachebust";

interface SettingsModalProps {
  initialUsername: string;
  user: {
    id: string;
    imageExists: boolean;
  };
}

export const SettingsModal = ({
  initialUsername,
  user,
}: SettingsModalProps) => {
  const [username, setUsername] = useState(initialUsername || "");
  const [image, setImage] = useState<File | null>();
  const [isPending, startTransition] = useTransition();
  const { userCacheBust, setUserCacheBust } = useCachebust();
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const pathname = usePathname();

  const initialPreview = user.imageExists
    ? `${process.env.NEXT_PUBLIC_AWS_BASE_IMAGE_URL}/UserProfiles/${user.id}?${userCacheBust}`
    : "";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      toast.error("Username can not be empty");
      return;
    }

    startTransition(() => {
      if (image) {
        uploadImageByUserId(image, user.id).then(() => {
          updateUser({ username: username })
            .then(() => {
              if (pathname.includes(initialUsername)) {
                router.push(pathname.replace(initialUsername, username));
              }
              router.refresh();
              setUserCacheBust();
              toast.success("User successfully updated");
              closeRef?.current?.click();
            })
            .catch((err) => toast.error(err.message));
        });
      }
    });
  };

  const inputHandler = (file: File | null) => {
    setImage(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
          />
          <ImageUpload
            initialPreview={initialPreview}
            center
            id="image"
            onInput={inputHandler}
          />
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
