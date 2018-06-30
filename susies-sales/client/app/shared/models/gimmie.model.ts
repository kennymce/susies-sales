import { Post } from "./post.model";

export class Gimmie {
  _id?: string;
  gimmieId: string;
  postId: string;
  Post: Post;
  userId: string;
  read: string;
  dateTimeRequested: Date;

  public constructor(gimmieId: string, userId: string, postId: string) {
    this.gimmieId = gimmieId;
    this.userId = userId;
    this.postId = postId;
    this.read = 'n';
  }
}
