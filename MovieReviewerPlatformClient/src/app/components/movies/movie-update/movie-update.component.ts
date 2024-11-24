import { Component, Input, OnInit } from '@angular/core';
import { MovieDto } from '../../../models/movieDto';
import { MovieService } from '../../../services/movie.service';
import { UserStoreService } from '../../../services/user-store.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserCommentDto } from '../../../models/userCommentDto';
import { GenreDto } from '../../../models/genreDto';

@Component({
  selector: 'app-movie-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-update.component.html',
  styleUrl: './movie-update.component.scss',
})
export class MovieUpdateComponent implements OnInit {
  movieId!: number;
  role!: string;
  newImageFile!: File;

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

  constructor(
    private movieService: MovieService,
    private userStore: UserStoreService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.movieId = +this.route.snapshot.paramMap.get('movieId')!;

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.movieService.getById(this.movieId).subscribe((res) => {
      this.selectedMovie = res;
    });
  }

  UpdateSelectedMovie() : void{
    this.movieService.updateMovieBy(this.movieId, this.selectedMovie).subscribe((res) =>{
      console.log("Movie updated successfully!");
      this.router.navigate(['/allMovies']);
    });
  }

  DeleteSelectedMovie() : void{
    this.movieService.deleteMovieBy(this.selectedMovie.id).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/allMovies']);
    });
  }

 

  UpdateMovieImage() {
    const movieId = this.selectedMovie.id; 
    const newImageFile = this.newImageFile; 
    if (!newImageFile) {
      console.error('No file selected for upload.');
      return;
    }
  
    this.movieService.updateMovieImage(movieId, newImageFile).subscribe({
      next: (response) => {
        console.log(response.message);
        this.selectedMovie.imageUrl = response.imageUrl; 
      },
      error: (err) => {
        console.error('Error updating image:', err);
      }
    });
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newImageFile = input.files[0];
    }
  }

  DeleteMovieImage() : void{
    this.movieService.delteMovieImage(this.selectedMovie.id).subscribe((res) => {
      console.log(res);
      this.selectedMovie.imageUrl = '';
       
    })
  }

}
