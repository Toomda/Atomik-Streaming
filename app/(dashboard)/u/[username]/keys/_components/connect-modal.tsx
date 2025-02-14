'use client';

import { useTransition, useRef, ElementRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { createIngress } from '@/actions/ingress';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const ConnectModal = () => {
  const closeRef = useRef<ElementRef<'button'>>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      createIngress()
        .then(() => {
          toast.success('Ingress created');
          closeRef.current?.click();
        })
        .catch(() => toast.error('Something went wrong'));
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Generate connection</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Connection</DialogTitle>
        </DialogHeader>
        <Select
          disabled={isPending}
          value={'RTMP'}
          onValueChange={(value) => {}}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ingress Type" />
            <SelectContent>
              <SelectItem value={'RTMP'}>RTMP</SelectItem>
              {/* <SelectItem value={WHIP}>WHIP</SelectItem> */}
            </SelectContent>
          </SelectTrigger>
        </Select>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            This action will reset all active streams using the current
            connection!
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <DialogClose ref={closeRef} asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={onSubmit} variant="primary" disabled={isPending}>
            Generate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
