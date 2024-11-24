import { GenreDto } from './genreDto';
import { UserCommentDto } from './userCommentDto';

export class MovieDto {
  id!: number;
  title!: string;
  genre!: GenreDto;
  releaseDate!: Date;
  directors!: string;
  cast!: string;
  imageUrl!: string;
  userComments!: UserCommentDto[];
}
