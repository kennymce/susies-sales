export class Gimmie {
  _id?: string;
  gimmieId: string;
  postId: string;
  userId: string;

  public constructor(gimmieId: string, userId: string, postId: string) {
    this.gimmieId = gimmieId;
    this.userId = userId;
    this.postId = postId;
  }
}
