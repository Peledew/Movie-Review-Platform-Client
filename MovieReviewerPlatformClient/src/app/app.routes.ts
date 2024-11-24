import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AddMovieComponent } from './components/movies/add-movie/add-movie.component';
import { AllMoviesComponent } from './components/movies/all-movies/all-movies.component';
import { AllGenresComponent } from './components/genres/all-genres/all-genres.component';
import { AddGenreComponent } from './components/genres/add-genre/add-genre.component';
import { UserReviewComponent } from './components/user-review/user-review.component';
import { MovieUpdateComponent } from './components/movies/movie-update/movie-update.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'addMovie', component: AddMovieComponent, canActivate: [AuthGuard] },
  { path: 'allMovies', component: AllMoviesComponent, canActivate: [AuthGuard] },
  { path: 'allGenres', component: AllGenresComponent, canActivate: [AuthGuard] },
  { path: 'addGenre', component: AddGenreComponent, canActivate: [AuthGuard] },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'userReview/:movieId', component: UserReviewComponent, canActivate: [AuthGuard] },
  { path: 'movieUpdate/:movieId', component: MovieUpdateComponent, canActivate: [AuthGuard] },
];
