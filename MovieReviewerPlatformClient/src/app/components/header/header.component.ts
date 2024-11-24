import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { CommonModule } from '@angular/common';
declare var M: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public role!: string;
  constructor(private authService: AuthService, private userStore : UserStoreService) {}

  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    const sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
  }

  signOut(event: Event): void {
    event.preventDefault();
    this.authService.signOut();
  }
}
