"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Input } from "../ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunityItem } from "./community-item";
import { useRoom } from "@/context/room-context";

interface ChatCommunityProps {
  hostName: string;
  viewerName?: string;
  isHidden: boolean;
}

export const ChatCommunity = ({
  hostName,
  viewerName,
  isHidden,
}: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const { remoteViewer } = useRoom();

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Community is disabled</p>
      </div>
    );
  }

  return (
    <div className="p-4 ">
      <Input
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Community"
        className="border-white/10"
      />
      <ScrollArea className="gap-y-2 mt-4">
        <p className="text-center text-sm text-muted-foreground hidden last:block p-2">
          No results
        </p>
        {remoteViewer.map((viewer) => (
          <CommunityItem
            key={viewer.username}
            hostName={hostName}
            viewerName={viewerName}
            participantName={viewer.username}
            participantIdentity={viewer.id}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
