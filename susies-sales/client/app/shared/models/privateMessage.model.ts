export class PrivateMessage {
  _id?: string;
  privateMessageId: string;
  postId?: string;
  userId: string;
  toUser: string;
  message: string;

  public constructor(privateMessageId: string, userId: string, toUser: string, postId: string, message: string) {
    this.privateMessageId = privateMessageId;
    this.userId = userId;
    this.toUser = toUser;
    this.postId = postId;
    this.message = message;
  }
}
