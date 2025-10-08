
import { Component, NgModule, OnInit } from '@angular/core';
import { ConnexionComponent } from './connexion/connexion.component';
import { CompteComponent } from './compte/compte.component';
import { PublicationComponent } from './publication/publication.component';
import {  RouterOutlet } from '@angular/router';
import { AjoutAidesComponent } from './ajout-aides/ajout-aides.component';
import { AjoutVentesComponent } from './ajout-ventes/ajout-ventes.component';
import { PubaidesComponent } from './pubaides/pubaides.component';
import { InfoscompteComponent } from './infoscompte/infoscompte.component';
import { PasswordComponent } from "./password/password.component";
import { HistoventesComponent } from './histoventes/histoventes.component';
import { HistoaidesComponent } from './histoaides/histoaides.component';
import { SessionService } from './session.service';
import { NgIf } from '@angular/common';






@Component({
  selector: 'app-root',
  standalone:true,
  imports: [ConnexionComponent, CompteComponent, PublicationComponent, AjoutAidesComponent, RouterOutlet, AjoutVentesComponent, PubaidesComponent, InfoscompteComponent, PasswordComponent,HistoventesComponent,HistoaidesComponent,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {
   constructor(private sessionService: SessionService) {}

showCookieBanner = false;

  ngOnInit(): void {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      this.showCookieBanner = true; // Affiche le message si pas encore choisi
    }
  }

  acceptCookies(): void {
    localStorage.setItem('cookieConsent', 'accepted');
    this.showCookieBanner = false;
  }

  declineCookies(): void {
    localStorage.setItem('cookieConsent', 'declined');
    this.showCookieBanner = false;
  }

   }


