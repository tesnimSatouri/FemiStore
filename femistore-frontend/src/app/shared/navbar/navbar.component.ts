import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../features/user/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // S’abonner à l’état de connexion
    this.authService.getLoggedInStatus().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/users/login'; // ou utilise Router.navigate
  }
}
