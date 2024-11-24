import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieDto } from '../../../models/movieDto';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { UserStoreService } from '../../../services/user-store.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: MovieDto;
  avgRating!: number;
  role!: string;
  constructor(
    private router: Router,
    private movieService: MovieService,
    private userStore: UserStoreService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.movieService.getAvgMovieRatingBy(this.movie.id).subscribe((res) => {
      this.avgRating = res;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  openUserReview(): void {
    this.router.navigate(['/userReview', this.movie.id]);
  }

  UpdateMovie(): void {
    this.router.navigate(['/movieUpdate', this.movie.id]);
  }
}
