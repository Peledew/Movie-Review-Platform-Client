import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenreDto } from '../models/genreDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private baseUrl = 'https://localhost:7001/api/Genres';

  constructor(private http: HttpClient) {}

  add(genreData: GenreDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, genreData);
  }

  getAll() {
    return this.http.get<GenreDto[]>(`${this.baseUrl}`);
  }
}
