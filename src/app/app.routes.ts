import { HistoventesComponent } from './histoventes/histoventes.component';
import { RouterModule, Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { NgModule } from '@angular/core';
import { CompteComponent } from './compte/compte.component';
import { PublicationComponent } from './publication/publication.component';
import { AjoutAidesComponent } from './ajout-aides/ajout-aides.component';
import { AjoutVentesComponent } from './ajout-ventes/ajout-ventes.component';
import { PubaidesComponent } from './pubaides/pubaides.component';
import { InfoscompteComponent } from './infoscompte/infoscompte.component';
import { PasswordComponent } from './password/password.component';
import { HistoaidesComponent } from './histoaides/histoaides.component';
import { PubventesComponent } from './pubventes/pubventes.component';

export const routes: Routes = [


         {path:'', component: ConnexionComponent },
         {path:'compte',component:CompteComponent},
         {path:'publication',component:PublicationComponent},
         {path:'ajout-aides',component:AjoutAidesComponent},
         {path:'ajout-ventes',component:AjoutVentesComponent},
         {path:'pubaides',component:PubaidesComponent},
         {path:'infoscompte',component:InfoscompteComponent},
         {path:'password',component:PasswordComponent},
         {path:'histoventes',component:HistoventesComponent},
         {path:'histoaides',component:HistoaidesComponent},
         {path:'pubventes',component:PubventesComponent},





];



@NgModule({
    imports:
    [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}

