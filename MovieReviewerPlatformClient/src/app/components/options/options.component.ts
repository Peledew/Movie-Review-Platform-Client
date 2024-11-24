import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent implements OnInit {
  public role!: string;
  constructor(
    private router: Router,
    private userStore: UserStoreService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
