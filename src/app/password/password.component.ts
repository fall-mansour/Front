import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgClass, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environnement'; // <-- ajouté

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule, NgClass, UpperCasePipe]
})
export class PasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordStrength: 'faible' | 'moyen' | 'fort' = 'faible';
  errorMessage: string | null = null;

  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private http: HttpClient, private router: Router) {}

  checkStrength(password: string) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) this.passwordStrength = 'faible';
    else if (hasUpperCase && hasSpecialChar) this.passwordStrength = 'fort';
    else this.passwordStrength = 'moyen';
  }

  onSubmit() {
    this.errorMessage = null;

    if (!this.email || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.passwordStrength !== 'fort') {
      this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial';
      return;
    }

    this.http.post<{ message: string; error?: string }>(
      `${environment.apiUrl}/password/reset-password`,
      {
        mail: this.email.trim().toLowerCase(),
        password: this.newPassword,
        confirmPassword: this.confirmPassword
      }
    ).subscribe({
      next: (res) => {
        alert(res.message || 'Mot de passe réinitialisé avec succès ✅');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || err.error?.message || 'Erreur inconnue lors de la réinitialisation';
        console.error('Erreur API reset-password:', err);
      }
    });
  }
}
