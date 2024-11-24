import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserCommentDto } from '../models/userCommentDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCommentService {
  private baseUrl = 'https://localhost:7001/api/UserComments';
  constructor(private http: HttpClient) {}

  //TODO: ispravi any
  add(userCommentData: UserCommentDto): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userCommentData);
  }
}
