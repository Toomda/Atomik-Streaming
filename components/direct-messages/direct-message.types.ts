interface DirectMessage {
  id: string;
  text: string;
  sendBy: {
    username: string;
    image: string;
  };
  sendTo: {
    username: string;
    image: string;
  };
  createdAt: Date;
  messageRead: boolean;
}

interface DirectMessageChat {
  partnerId: string;
  messages: DirectMessage[];
  chatRead: boolean;
  partnerDetails: {
    username: string;
    id: string;
  };
}
