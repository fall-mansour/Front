import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../environnement'; // <-- ajouté

@Component({
  selector: 'app-connexion',
  standalone: true,
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ConnexionComponent {
  mail: string = '';
  password: string = '';
  isLoading = false;
  messageErreur: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  goacceuil() {
    this.router.navigate(['']);
  }

  seConnecter(event: Event) {
    event.preventDefault();
    this.messageErreur = null;

    if (!this.mail || !this.password) {
      this.messageErreur = 'Veuillez saisir email et mot de passe';
      return;
    }

    this.isLoading = true;

    this.http.post(`${environment.apiUrl}/connexion`, {
      mail: this.mail,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        const utilisateur = response.utilisateur;
        const statut = utilisateur?.statut?.toLowerCase();

        if (!utilisateur?.id) {
          this.messageErreur = 'Erreur : ID utilisateur manquant dans la réponse';
          return;
        }

        localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
        localStorage.setItem('userId', utilisateur.id.toString());

        switch (statut) {
          case 'donateur':
          case 'beneficiaire':
            this.router.navigate(['/pubaides']);
            break;
          case 'vendeur':
          case 'acheteur':
            this.router.navigate(['/pubventes']);
            break;
          default:
            this.messageErreur = 'Statut utilisateur non reconnu';
            break;
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.messageErreur = 'Login ou mot de passe incorrect';
        } else {
          this.messageErreur = 'Erreur serveur, veuillez réessayer plus tard';
        }
      }
    });
  }
}
