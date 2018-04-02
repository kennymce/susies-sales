export interface IPrivateMessage {
  privateMessageId: string;
  postId?: string;
  userId: string;
  toUser: string;
  message: string;
}
