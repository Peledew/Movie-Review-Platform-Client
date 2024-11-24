import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRatingDto } from '../models/userRatingDto';

@Injectable({
  providedIn: 'root',
})
export class UserRatingService {
  private baseUrl = 'https://localhost:7001/api/UserRatings';
  constructor(private http: HttpClient) {}

  //TODO: ispravi any
  add(userRatingData: UserRatingDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userRatingData);
  }

  getByMovieId(id: number) {
    return this.http.get<UserRatingDto[]>(`${this.baseUrl}/${id}`);
  }

  tryRating(id: number) {
    return this.http.get<boolean>(`${this.baseUrl}/rate/${id}`);
  }
}
