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
import { useTransition, useRef, ElementRef } from 'react';
// import { deleteUserById } from "@/actions/user";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface DeleteModalProps {
  userId: string;
}

export const DeleteModal = ({ userId }: DeleteModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState('');
  const closeRef = useRef<ElementRef<'button'>>(null);
  const router = useRouter();

  const onDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // startTransition(async () => {
    //   deleteUserById(userId, password)
    //     .then(() => {
    //       closeRef?.current?.click();
    //       toast.success("User deleted successfully");
    //     })
    //     .catch((e) => {
    //       toast.error(e.message);
    //     });
    // });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full justify-center"
          size="sm"
        >
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={onDelete} className="space-y-8 pt-10">
          <p className="">Type in your password to delete your Account</p>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={isPending}>
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
