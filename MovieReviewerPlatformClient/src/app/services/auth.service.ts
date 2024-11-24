import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';
import { Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserStoreService } from './user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7001/api/Users/';
  private userPayload: any;

  private resetFormSubject = new Subject<void>();
  resetForm$ = this.resetFormSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private userStore: UserStoreService,
  ) {
    this.userPayload = this.decodedToken();
  }

  triggerFormReset() {
    this.resetFormSubject.next();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj: any): Observable<TokenApiModel> {
    this.triggerFormReset();
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // !! -> converts string to boolean value
  }

  signOut() {
    localStorage.clear();
    this.userStore.setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['login']);
  }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi);
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    //console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token);
  }

  getfullNameFromToken() {
    if (this.userPayload) return this.userPayload.unique_name;
  }

  getRoleFromToken() {
    if (this.userPayload) return this.userPayload.role;
  }

  public setIsLoggedIn(status: boolean): void {
    localStorage.setItem('isLoggedIn', JSON.stringify(status));
  }

  public getIsLoggedIn(): boolean {
    const status = localStorage.getItem('isLoggedIn');
    return status ? JSON.parse(status) : false;
  }
}
