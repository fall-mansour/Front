import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { environment } from '../../environnement'; // <-- ajouté

@Component({
  selector: 'app-compte',
  standalone: true,
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss'],
  imports: [FormsModule, NgIf]
})
export class CompteComponent {
  formData = {
    nom: '',
    mail: '',
    password: '',
    telephone: '',
    adresse: '',
    statut: ''
  };

  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  goacceuil() {
    this.router.navigate(['']);
  }

  creerCompte(form: NgForm) {
    console.log('Etat du formulaire:', form.value);
    console.log('Nom valide ?', form.controls['nom']?.valid);
    console.log('Mail valide ?', form.controls['mail']?.valid);
    console.log('Password valide ?', form.controls['password']?.valid);
    console.log('Statut valide ?', form.controls['statut']?.valid);

    this.errorMessage = null;
    this.successMessage = null;

    if (form.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    this.isLoading = true;

    this.http.post(`${environment.apiUrl}/compte/creer`, this.formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Compte créé avec succès! Redirection...';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur création compte:', error);

        if (error.status === 409) {
          this.errorMessage = 'Un compte existe déjà avec cette adresse email';
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        }
      }
    });
  }
}
