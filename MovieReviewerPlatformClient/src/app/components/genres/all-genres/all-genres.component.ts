import { Component, OnInit } from '@angular/core';
import { GenreDto } from '../../../models/genreDto';
import { GenreService } from '../../../services/genre.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-genres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-genres.component.html',
  styleUrl: './all-genres.component.scss',
})
export class AllGenresComponent implements OnInit {
  genres: GenreDto[] = [];

  constructor(private genreService: GenreService) {}

  ngOnInit() {
    this.genreService.getAll().subscribe((res: GenreDto[]) => {
      this.genres = res;
    });
  }
}
