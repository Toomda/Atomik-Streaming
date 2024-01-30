"use client";
import { stringToColor } from "@/lib/utils";
import { ChatMessage as Message, useRoom } from "@/context/room-context";
import { format } from "date-fns";
import Image from "next/image";

interface ChatMessageProps {
  data: Message;
}

export const ChatMessage = ({ data }: ChatMessageProps) => {
  const color = stringToColor(data.author || "");
  const { isModerator, localViewer } = useRoom();

  return (
    <div className="flex gap-2 p-2 rounded-md hover:bg-white/5">
      {data.author !== "" ? (
        <>
          <p className="text-sm text-white/40">
            {format(data.timestamp, "HH:MM")}
          </p>
          <div className="flex flex-wrap items-baseline gap-1 grow">
            {isModerator && localViewer.username === data.author && (
              <Image
                src="/moderator-sword.svg"
                alt="Moderator"
                width={20}
                height={20}
                className="self-center"
              />
            )}

            <p className="text-sm font-semibold whitespace-nowrap">
              <span className="truncate" style={{ color: color }}>
                {data.author}
              </span>
              :
            </p>
            <p className="text-sm break-all">{data.message}</p>
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-baseline gap-1 grow">
          <p className="text-sm text-white/40">{data.message}</p>
        </div>
      )}
    </div>
  );
};
