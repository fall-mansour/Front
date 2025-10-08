import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private timeoutId: any;
  private readonly TIMEOUT = 10 * 60 * 1000; // 10 minutes
  private events = ['mousemove', 'keydown', 'scroll', 'click'];
  private eventHandlers: any[] = [];

  constructor(private router: Router, private ngZone: NgZone) {
    this.initListener();
    this.startTimer();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('connexion') || event.url.includes('compte')) {
          clearTimeout(this.timeoutId);
        } else {
          this.resetTimer();
        }
      }
    });
  }

  private initListener(): void {
    this.events.forEach(evt => {
      const handler = () => this.resetTimer();
      window.addEventListener(evt, handler);
      this.eventHandlers.push({ evt, handler });
    });
  }

  private startTimer(): void {
    this.timeoutId = setTimeout(() => this.logout(), this.TIMEOUT);
  }

  private resetTimer(): void {
    clearTimeout(this.timeoutId);
    this.startTimer();
  }

  private logout(): void {
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('userId');
    this.ngZone.run(() => this.router.navigate(['/connexion']));
  }

  ngOnDestroy() {
    this.eventHandlers.forEach(({ evt, handler }) => window.removeEventListener(evt, handler));
  }
}
