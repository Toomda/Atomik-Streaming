import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import useSocketStore from "@/store/use-socket";

interface DirectMessageChatProps {
  selectedChat: DirectMessageChat;
  username: string;
  sendDirectMessage: (sendBy: string, sendTo: string, text: string) => void;
}

export const DirectMessageChat = ({
  selectedChat,
  username,
  sendDirectMessage,
}: DirectMessageChatProps) => {
  const [message, setMessage] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const scroll = scrollRef.current;

    if (scroll) {
      const viewport = scroll.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat.messages]);

  const onMessageSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message || !selectedChat) return;

    sendDirectMessage(username, selectedChat.partnerDetails.username, message);

    setMessage("");
  };

  return (
    <div className="h-52 w-96 flex-col flex justify-end">
      <ScrollArea type="scroll" className="px-2" ref={scrollRef}>
        {selectedChat.messages.map((msg) => (
          <div key={msg.id} className="mb-2 flex space-x-1">
            <p className="font-semibold">{msg.sendBy.username}</p>:
            <p>{msg.text}</p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={onMessageSend} className="flex space-x-1 px-1 pb-1">
        <Input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
          placeholder="Send a message..."
          className="focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-2"
        />
        <Button type="submit" variant="primary">
          Send
        </Button>
      </form>
    </div>
  );
};
