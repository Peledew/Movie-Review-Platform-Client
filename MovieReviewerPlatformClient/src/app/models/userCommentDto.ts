export class UserCommentDto {
  comment: string = '';
  userName: string = '';
  movieId: number = -1;
  userId: number = -1;

  constructor(init?: Partial<UserCommentDto>) {
    Object.assign(this, init);
  }
}
