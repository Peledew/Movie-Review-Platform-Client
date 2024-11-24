import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieDto } from '../../../models/movieDto';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { GenreDto } from '../../../models/genreDto';
import { GenreService } from '../../../services/genre.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [MovieCardComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './all-movies.component.html',
  styleUrl: './all-movies.component.scss',
})
export class AllMoviesComponent implements OnInit {
  currentMovies: MovieDto[] = [];
  genres: GenreDto[] = [];
  searchForm!: FormGroup;

  constructor(
    private movieService: MovieService,
    private genreService: GenreService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      inputReleaseYear: [null],
      inputTitle: [''],
      selectedGenreId: [null],
    });
    const { inputReleaseYear, inputTitle, selectedGenreId } = this.searchForm.value;
    this.movieService
      .getBySearchParameters(inputReleaseYear, inputTitle, selectedGenreId)
      .subscribe((res: MovieDto[]) => {
        this.currentMovies = res;
      });

    this.genreService.getAll().subscribe((res: GenreDto[]) => {
      this.genres = res;
    });
  }

  ResetFilters() {
    this.searchForm.reset();
  }

  SearchByParameters() {
    const { inputReleaseYear, inputTitle, selectedGenreId } = this.searchForm.value;

    this.movieService
      .getBySearchParameters(inputReleaseYear, inputTitle, selectedGenreId)
      .subscribe((res: MovieDto[]) => {
        this.currentMovies = res;
      });
  }
}
