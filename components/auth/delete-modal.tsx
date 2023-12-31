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
import { deleteUserById } from '@/actions/user';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

interface DeleteModalProps {
  userId: string;
}

export const DeleteModal = ({ userId }: DeleteModalProps) => {
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<ElementRef<'button'>>(null);

  const onDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      deleteUserById(userId)
        .then(() => {
          closeRef?.current?.click();
          toast.success('User deleted successfully');
          signOut();
        })
        .catch((e) => {
          toast.error(e.message);
        });
    });
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
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <form onSubmit={onDelete} className="space-y-8 pt-10">
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
