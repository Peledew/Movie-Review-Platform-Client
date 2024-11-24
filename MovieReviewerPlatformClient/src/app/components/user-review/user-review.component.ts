import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRatingDto } from '../../models/userRatingDto';
import { UserRatingService } from '../../services/user-rating.service';
import { MovieDto } from '../../models/movieDto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GenreDto } from '../../models/genreDto';
import { UserCommentDto } from '../../models/userCommentDto';
import { UserCommentService } from '../../services/user-comment.service';
import { CommonModule } from '@angular/common';
import { SignalrService } from '../../services/signalr.service';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-review',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-review.component.html',
  styleUrl: './user-review.component.scss',
})
export class UserReviewComponent implements OnInit, OnDestroy {
  movieId!: number;
  newComment: UserCommentDto = { comment: '', userName: '', movieId: -1, userId: -1 };
  selectedMovie: MovieDto = {
    id: 0,
    title: '',
    genre: new GenreDto(),
    releaseDate: new Date(),
    directors: '',
    cast: '',
    imageUrl: '',
    userComments: [] as UserCommentDto[],
  };
  avgRating!: number;
  newRating: UserRatingDto = { movieId: -1, userId: -1, rating: 5 };
  canRate!: boolean;
  submitedNewComment!: UserCommentDto;
  loggedUserUserName!: string;
  role!: string;

  constructor(
    private route: ActivatedRoute,
    private userRatingService: UserRatingService,
    private userCommentService: UserCommentService,
    private movieService: MovieService,
    private signalrService: SignalrService,
    private userStore: UserStoreService,
    private authService: AuthService,
  ) {} 

  ngOnInit(): void {
    this.movieId = +this.route.snapshot.paramMap.get('movieId')!;

    this.movieService.getById(this.movieId).subscribe((res) => {
      this.selectedMovie = res;
      this.newRating.movieId = this.selectedMovie.id;
    });

    this.userRatingService.tryRating(this.movieId).subscribe((res) => {
      this.canRate = res;
      this.newRating.movieId = this.selectedMovie.id;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.movieService.getAvgMovieRatingBy(this.movieId).subscribe((res) => {
      this.avgRating = res;
    });

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.authService.getfullNameFromToken();
      this.loggedUserUserName = val || fullNameFromToken;
    });

    this.signalrService.startConnection();
    this.signalrService.joinMovieGroup(this.movieId.toString());
    this.signalrService.addCommentListener();

    this.signalrService.comment$.subscribe((comment) => {
      if (comment && comment.movieId === this.movieId) {
         this.selectedMovie.userComments.push(comment);
      }
    });

    this.CanRate();
  }

  SubmitComment(): void {
    this.newComment.movieId = this.selectedMovie.id;
    this.newComment.userName = this.loggedUserUserName;
    this.userCommentService.add(this.newComment).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => console.error('Error submitting comment:', error),
    });
  }

  RateMovie(): void {
    this.userRatingService.add(this.newRating).subscribe({
      next: (response) => console.log('Movie has been rated! ', response),
      error: (error) => console.error('Error adding movie:', error),
    });
    this.canRate = false;
  }

  CanRate() {
  if (this.role === 'Admin') {
    return true;
  }
  return !this.canRate;
}


  ngOnDestroy(): void {
    // Leave the group and stop the SignalR connection when the component is destroyed
    if (this.signalrService) {
      this.signalrService.leaveMovieGroup(this.movieId.toString());
      this.signalrService.stopConnection();
    }
  }
}
