import { Post } from "../shared/models/post.model";

export interface IGimmie {
  gimmieId: string;
  postId: string;
  Post: Post;
  userId: string;
  read: string;
  dateTimeRequested: Date;
}
