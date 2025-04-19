import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    role: 'Client',
    adresse: '',
    telephone: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Erreur d’inscription:', error);
        alert('Erreur lors de l’inscription');
      }
    });
  }
}