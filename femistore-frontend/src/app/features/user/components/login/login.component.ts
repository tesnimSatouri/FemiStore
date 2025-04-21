import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.authService.setUser(response.user); // 👈 Sauvegarder l'utilisateur
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Erreur de connexion:', error);
        alert('Erreur lors de la connexion');
      }
    });
  }
}
