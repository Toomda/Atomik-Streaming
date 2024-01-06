import * as React from 'react';

/** @public */
export const RoomContext = React.createContext<Room | undefined>(undefined);

/**
 * Ensures that a room is provided via context.
 * If no room is provided, an error is thrown.
 * @public
 */
export function useRoomContext() {
  const ctx = React.useContext(RoomContext);
  if (!ctx) {
    throw Error(
      'tried to access room context outside of livekit room component'
    );
  }
  return ctx;
}
