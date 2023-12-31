'use client';

import { useState, useTransition, useRef, ElementRef } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { updateStream } from '@/actions/stream';
import { toast } from 'sonner';
import { UploadDropzone } from '@/lib/uploadthing';
import { Hint } from '@/components/hint';
import { Trash } from 'lucide-react';
import Image from 'next/image';

interface InfoModalProps {
  initialName: string;
  initialThumbnail: string | null;
}

export const InfoModal = ({
  initialName,
  initialThumbnail,
}: InfoModalProps) => {
  const [name, setName] = useState(initialName);
  const [thumbnail, setThumbnail] = useState(initialThumbnail);

  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<ElementRef<'button'>>(null);
  const router = useRouter();

  const onRemoveThumbnail = () => {
    startTransition(() => {
      updateStream({ thumbnail: null })
        .then(() => {
          toast.success('Thumbnail removed');
          setThumbnail('');
        })
        .catch(() => toast.error('Something went wrong'));
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateStream({ name: name })
        .then(() => {
          toast.success('Stream updated successfully');
          closeRef?.current?.click();
        })
        .catch(() => toast.error('Something went wrong'));
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form className="space-y-14" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            {thumbnail ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-[10]">
                  <Hint label="Remove thumbnail" asChild side="left">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={onRemoveThumbnail}
                      className="h-auto w-auto p-1.5"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="rounded-xl border outline-dashed outline-muted">
                <UploadDropzone
                  endpoint="thumbnailUploader"
                  appearance={{
                    label: { color: '#FFFFFF' },
                    allowedContent: {
                      color: '#FFFFFF',
                    },
                  }}
                  onClientUploadComplete={(res) => {
                    setThumbnail(res?.[0]?.url);
                    router.refresh();
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="primary" type="submit" disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
