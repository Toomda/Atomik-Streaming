'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/hint';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState, useTransition, useRef, ElementRef } from 'react';
import { updateUser } from '../../lib/user-service';
import { toast } from 'sonner';
import { Settings, Trash } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing';
import { usePathname, useRouter } from 'next/navigation';
import ImageUpload from './image-upload';
import axios from 'axios';
import { getSelf } from '@/lib/auth-service';

interface SettingsModalProps {
  initialUsername: string;
  initialImage: string | null;
}

export const SettingsModal = ({
  initialUsername,
  initialImage,
}: SettingsModalProps) => {
  const [username, setUsername] = useState(initialUsername || '');
  const [image, setImage] = useState<File>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const closeRef = useRef<ElementRef<'button'>>(null);
  const pathname = usePathname();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      toast.error('Username can not be empty');
      return;
    }

    const formData = new FormData();
    formData.append('image', image!);
    formData.append('username', username);

    startTransition(() => {
      updateUser({ username: username, image: image })
        .then(() => {
          if (pathname.includes(initialUsername)) {
            router.push(pathname.replace(initialUsername, username));
          }
          router.refresh();
          toast.success('User successfully updated');
          closeRef?.current?.click();
        })
        .catch((err) => toast.error(err.message));
    });
  };

  const onRemoveImage = () => {
    // startTransition(() => {
    //   updateUser({ image: null })
    //     .then(() => {
    //       toast.success('Image removed');
    //       setImage(undefined);
    //     })
    //     .catch(() => toast.error('Something went wrong'));
    // });
  };

  const inputHandler = (file: File) => {
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
            center
            errorText="Something went wrong"
            id="image"
            onInput={inputHandler}
          />
          {/* {image ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
              <div className="absolute top-2 right-2 z-[10]">
                <Hint label="Remove image" asChild side="left">
                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={onRemoveImage}
                    className="h-auto w-auto p-1.5"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </Hint>
              </div>
              <Image src={image} alt="Image" fill className="object-cover" />
            </div>
          ) : (
            <div className="rounded-xl border outline-dashed outline-muted">
              <UploadDropzone
                endpoint="imageUploader"
                appearance={{
                  label: { color: '#FFFFFF' },
                  allowedContent: {
                    color: '#FFFFFF',
                  },
                }}
                onClientUploadComplete={(res) => {
                  setImage(res?.[0]?.url);
                  router.refresh();
                }}
              />
            </div>
          )} */}
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
