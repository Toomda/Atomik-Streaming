'use client';

import { Input } from '@/components/ui/input';
import { CopyButton } from './copy-button';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

import { useState } from 'react';

interface KeyCardProps {
  value: string | null;
}

export const KeyCard = ({ value }: KeyCardProps) => {
  const [show, setShow] = useState(false);

  const Icon = show ? EyeOff : Eye;

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-start gap-x-10">
        <p className="font-semibold shrink-0">Stream Key</p>
        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <Input
              value={value || ''}
              type={show ? 'text' : 'password'}
              disabled
              placeholder="Stream Key"
            />
            <CopyButton value={value || ''} />
          </div>
          <div className="w-full flex items-center">
            <Icon className="h-4 w-4" />
            <Button size="sm" variant="link" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
