import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CompteComponent } from './compte/compte.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { PublicationComponent } from './publication/publication.component';
import { HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  
  imports: [
    AppComponent,
    CompteComponent,
    ConnexionComponent,
    AcceuilComponent,
    PublicationComponent,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
    

  ],

})
export class AppModule { }