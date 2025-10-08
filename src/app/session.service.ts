// src/app/services/session.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timeoutId: any;
  private readonly TIMEOUT = 10 * 60 * 1000; // 10 minutes

  constructor(private router: Router, private ngZone: NgZone) {
    this.initListener();
    this.startTimer();

    // Désactiver le timer sur connexion/compte
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('connexion') || event.url.includes('compte')) {
          clearTimeout(this.timeoutId); // Pas de déconnexion
        } else {
          this.resetTimer(); // Timer actif ailleurs
        }
      }
    });
  }

  /** Écoute des événements utilisateur */
  private initListener(): void {
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
    window.addEventListener('scroll', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
  }

  /** Démarrage du compte à rebours */
  private startTimer(): void {
    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.TIMEOUT);
  }

  /** Réinitialisation du timer */
  private resetTimer(): void {
    clearTimeout(this.timeoutId);
    this.startTimer();
  }

  /** Action en cas d’expiration */
  private logout(): void {
    localStorage.removeItem('user'); // Nettoyer la session locale
    this.ngZone.run(() => {
      this.router.navigate(['/connexion']); // Redirection vers connexion
    });
  }
}
