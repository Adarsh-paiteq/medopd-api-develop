export const WEBSOCKET_SERVER_EVENT = {
  CHATS_JOIN: 'chats/join',
  CHATS_MESSAGES: 'chats/messages',
} as const;

export const WEBSOCKET_CLIENT_EVENT = {
  CHATS_JOIN_ACK: (userId: string) => `users/${userId}/join/ack`,
  CHATS_MESSAGE: (chatId: string) => `chats/${chatId}/message`,
} as const;

export type ObjectValue<T> = T[keyof T];

export type WebsocketServerEvent = ObjectValue<typeof WEBSOCKET_SERVER_EVENT>;
export type WebsocketClientEvent = ObjectValue<typeof WEBSOCKET_CLIENT_EVENT>;
