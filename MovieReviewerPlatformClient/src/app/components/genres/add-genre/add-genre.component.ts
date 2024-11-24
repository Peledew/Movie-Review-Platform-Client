import { Component } from '@angular/core';
import { GenreDto } from '../../../models/genreDto';
import { FormsModule } from '@angular/forms';
import { GenreService } from '../../../services/genre.service';

@Component({
  selector: 'app-add-genre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-genre.component.html',
  styleUrl: './add-genre.component.scss',
})
export class AddGenreComponent {
  genreData: GenreDto = { id: 0, name: '', description: '' };

  constructor(private genreService: GenreService) {}

  onSubmit() {
    this.genreService.add(this.genreData).subscribe({
      next: (response) => console.log('Genre added successfully:', response),
      error: (error) => console.error('Error adding genre:', error),
    });
    this.genreData.name = "";
    this.genreData.description = "";
  }
}
