import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/user/services/auth.service';
import { UserService } from '../../features/user/services/user.service';
import { User } from '../../features/user/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  user: User | null = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;

      if (status) {
        const role = this.authService.getUserRole();
        this.isAdmin = role === 'Admin'; // ✅ adapte à 'Admin'
      } else {
        this.isAdmin = false;
      }
    });

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.isAdmin = user.role === 'Admin'; // ✅ adapte à 'Admin'
      },
      error: (error) => console.error('Erreur profil:', error)
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/users/login';
  }
}
