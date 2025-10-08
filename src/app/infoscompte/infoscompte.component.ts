import { Component, OnInit } from '@angular/core';
import { InfosService } from '../infos.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infoscompte',
  templateUrl: './infoscompte.component.html',
  styleUrls: ['./infoscompte.component.scss'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor]
})
export class InfoscompteComponent implements OnInit {
  utilisateur: any = {
    nom: '',
    mail: '',
    telephone: '',
    adresse: '',
    statut: ''
  };

  statutsDisponibles = ['donateur', 'beneficiaire', 'vendeur', 'acheteur'];

  messageSuccess: string = '';
  messageError: string = '';
  tempsRestantStatut: number = 0; // en secondes
  menuOuvert: boolean = false;
  private intervalId: any;

  constructor(private infosService: InfosService, private router: Router) {}

  ngOnInit(): void {
    const utilisateurLocal = JSON.parse(localStorage.getItem('utilisateur') || '{}');

    if (utilisateurLocal.mail) {
      this.infosService.getInfos(utilisateurLocal.mail).subscribe({
        next: (data) => {
          this.utilisateur = data;
          // Si le backend renvoie un temps restant, on initialise le compteur
          if (data.tempsRestant) {
            this.startCountdown(data.tempsRestant);
          }
        },
        error: (err) => {
          this.messageError = '❌ Erreur lors du chargement des informations';
          console.error(err);
        }
      });
    }
  }

  updateInfos() {
    this.messageSuccess = '';
    this.messageError = '';

    this.infosService.updateInfos(this.utilisateur.mail, this.utilisateur).subscribe({
      next: (res: any) => {
        this.messageSuccess = '✅ Informations mises à jour avec succès !';
        // Si le backend renvoie un temps restant pour le statut
        if (res.tempsRestant) {
          this.startCountdown(res.tempsRestant);
        } else {
          this.tempsRestantStatut = 0;
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.messageError = `❌ ${err.error.message}`;
          if (err.error.tempsRestant) {
            this.startCountdown(err.error.tempsRestant);
          }
        } else {
          this.messageError = '❌ Erreur lors de la mise à jour';
        }
      }
    });
  }

  get tempsRestantFormat(): string {
  if (this.tempsRestantStatut <= 0) return '';
  const totalMinutes = Math.ceil(this.tempsRestantStatut / 60);
  const jours = Math.floor(totalMinutes / (60 * 24));
  const heures = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return `${jours}j ${heures}h ${minutes}m`;
}


  // Démarrer le compte à rebours pour le statut
  private startCountdown(temps: number) {
    this.tempsRestantStatut = temps;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      if (this.tempsRestantStatut > 0) {
        this.tempsRestantStatut--;
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  // Méthodes navigation menu
  redirigeracceuil() { this.router.navigate(['/']); this.menuOuvert = false; }
  redirigeraides() { this.router.navigate(['/pubaides']); this.menuOuvert = false; }
  redirigerventes() { this.router.navigate(['/pubventes']); this.menuOuvert = false; }
  redirigerajoutaides() { this.router.navigate(['/ajout-aides']); this.menuOuvert = false; }
  redirigerajoutventes() { this.router.navigate(['/ajout-ventes']); this.menuOuvert = false; }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
