import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieDto } from '../models/movieDto';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = 'https://localhost:7001/api/Movies';

  constructor(private http: HttpClient) {}

  add(movieData: MovieDto, imageFile: File): Observable<any> {
    const formData = new FormData();

    // Append movie details to FormData
    formData.append('newMovie.title', movieData.title);
    formData.append('newMovie.genre.id', movieData.genre.id.toString());

    // Ensure releaseDate is serialized correctly
    const releaseDate = new Date(movieData.releaseDate); // Convert to Date object
    formData.append('newMovie.releaseDate', releaseDate.toISOString()); // Convert Date to ISO string

    formData.append('newMovie.directors', movieData.directors);
    formData.append('newMovie.cast', movieData.cast);

    // Append the image file if selected
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.post(`${this.baseUrl}`, formData);
  }

  getAll() {
    return this.http.get<MovieDto[]>(`${this.baseUrl}`);
  }

  getById(id: number) {
    return this.http.get<MovieDto>(`${this.baseUrl}/${id}`);
  }

  getBySearchParameters(releaseYear: number | null, title: string | null, genreId: number | null) {
    releaseYear = releaseYear ?? 0;
    genreId = genreId ?? 0;

    const params = {
      releaseYear: releaseYear.toString(),
      title: title || '',
      genreId: genreId.toString(),
    };

    return this.http.get<MovieDto[]>(`${this.baseUrl}/releaseYear/title/genre`, { params });
  }

  getAvgMovieRatingBy(id: number) {
    return this.http.get<number>(`${this.baseUrl}/avgrating/${id}`);
  }

  updateMovieBy(id: number, movieData: MovieDto) {
    return this.http.put<MovieDto>(`${this.baseUrl}/${id}`, movieData);
  }

  deleteMovieBy(id : number){
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateMovieImage(id: number, newImage: File) {
    const formData = new FormData();
    formData.append('newImage', newImage);
  
    return this.http.put<{ status: number; message: string; imageUrl: string }>(
      `${this.baseUrl}/update-image/${id}`,
      formData
    );
  }
  
  delteMovieImage(id : number){
    return this.http.delete<void>(`${this.baseUrl}/${id}/delete-image`);
  }
  
}
