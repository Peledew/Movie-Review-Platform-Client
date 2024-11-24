import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../services/movie.service';
import { MovieDto } from '../../../models/movieDto';
import { provideNativeDateAdapter } from '@angular/material/core';
import { GenreDto } from '../../../models/genreDto';
import { GenreService } from '../../../services/genre.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { UserCommentDto } from '../../../models/userCommentDto';

declare var M: any;
@Component({
  selector: 'app-add-movie',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.scss',
})
export class AddMovieComponent implements OnInit {
  movieData: MovieDto = {
    id: 0,
    title: '',
    genre: new GenreDto(),
    releaseDate: new Date(),
    directors: '',
    cast: '',
    imageUrl: '',
    userComments: [] as UserCommentDto[],
  };

  genres: GenreDto[] = [];
  imageFile: File | null = null; // Variable to hold the selected file

  constructor(
    private movieService: MovieService,
    private genreService: GenreService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.genreService.getAll().subscribe((res: GenreDto[]) => {
      this.genres = res;
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      // Handle file selection logic here (upload, preview, etc.)
      if (file) {
        this.imageFile = file;
      }
    }
  }

  onSubmit(): void {
    // Ensure releaseDate is a Date object
    if (this.movieData.releaseDate) {
      this.movieData.releaseDate = new Date(this.movieData.releaseDate);
    }

    if (this.imageFile) {
      this.movieService.add(this.movieData, this.imageFile).subscribe({
        next: (response) => this.router.navigate(['allMovies']),
        error: (error) => console.error('Error adding movie:', error),
      });
    } else {
      console.error('No image file selected.');
    }
  }
}
