export class PrivateMessage {
  _id?: string;
  privateMessageId: string;
  postId?: string;
  userId: string;
  message: string;

  public constructor(privateMessageId: string, userId: string, postId: string, message: string) {
    this.privateMessageId = privateMessageId;
    this.userId = userId;
    this.postId = postId;
    this.message = message;
  }
}
