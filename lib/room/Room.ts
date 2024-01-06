class Room {
  RemoteViewer: Participant[] = [];

  hostName: string = '';

  localViewer: Participant = {
    username: '',
  };

  isLive: boolean = false;
}
