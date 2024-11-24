import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public users: any = [];

  public fullName: string = '';
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private userStore: UserStoreService,
  ) {}

  ngOnInit() {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.authService.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });
  }

  signOut() {
    this.authService.signOut();
  }
}
